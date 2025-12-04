# OpenContext - Browser Extension

Built with React, TypeScript, and Vite

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open Chrome and navigate to `chrome://extensions/`, enable "Developer mode", and load the unpacked extension from the `dist` directory.

4. Build for production:

```bash
npm run build
```

## Project Structure

- `src/popup/` - Main extension popup UI (400x600px)
- `src/sidepanel/` - Side panel interface for extended functionality
- `src/content/` - Content script
- `src/components/` - Reusable UI components
- `src/index.css` - Global styles and design tokens
- `manifest.config.ts` - Extension manifest configuration

## Documentation

- [React Documentation](https://reactjs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [CRXJS Documentation](https://crxjs.dev/vite-plugin)

## Extension Development Notes

- Use `manifest.config.ts` to configure your extension
- The CRXJS plugin automatically handles manifest generation
