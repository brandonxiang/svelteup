// import path from 'path';

export default {
  entry: 'src/index.js',
  outdir: 'public/dist',
  compilerOptions: {
    customElement: false,
  },
  serveOptions: {
    fallback: 'public/index.html',
  },
};
