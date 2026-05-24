# svelteup-revealjs

A Reveal.js presentation starter powered by [reveal-md](https://github.com/webpro/reveal-md), [Svelte](https://svelte.dev/), and [svelteup](https://github.com/brandonxiang/svelteup).

You can use your svelte components in your markdown. It is a gorgeous feature to customize your oneline slide. For example:

```markdown
<my-element>
    <p>This is some slotted content</p>
</my-element>

# Reveal.js

### The HTML Presentation Framework
```

## Usage

### Development

```bash
pnpm i
pnpm dev
```

### Deployment

You can deploy the static resource to any platform, such as Vercel.

```bash
pnpm build
```

## License

[MIT](./LICENSE) @ HappyPlanet
