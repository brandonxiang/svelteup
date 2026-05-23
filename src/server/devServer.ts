import http from 'node:http';
import sirv from 'sirv';
import { ServeOptions } from '../interface/CommandOptions';

const reloadPath = '/svelteup-events';

export interface DevServer {
  host: string;
  port: number;
  reload: () => void;
  close: () => Promise<void>;
}

export const liveReloadScript = `;new EventSource('${reloadPath}').addEventListener('change', () => location.reload())`;

export async function createDevServer(options: ServeOptions): Promise<DevServer> {
  const clients = new Set<http.ServerResponse>();
  const serve = sirv(options.servedir, { dev: true });

  const server = http.createServer((req, res) => {
    if (req.url === reloadPath) {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });
      res.write('\n');
      clients.add(res);
      req.on('close', () => {
        clients.delete(res);
      });
      return;
    }

    serve(req, res);
  });

  await new Promise<void>((resolve) => {
    server.listen(options.port, options.host, resolve);
  });

  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : options.port;
  const host = options.host ?? 'localhost';

  return {
    host,
    port,
    reload() {
      for (const client of clients) {
        client.write('event: change\ndata: reload\n\n');
      }
    },
    close() {
      for (const client of clients) {
        client.end();
      }
      clients.clear();

      return new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    },
  };
}
