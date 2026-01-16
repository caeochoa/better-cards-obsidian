# Better Cards

A custom Bases view plugin for [Obsidian](https://obsidian.md) that displays your notes as beautiful cards with enhanced cover options. Create Pinterest-style card grids with images, colors, gradients, or content previews.

## Features

- **Multiple Cover Types**
  - 🖼️ **Images** - Use any image from your vault or external URLs
  - 🎨 **Solid Colors** - Auto-generated colors based on note names
  - 🌈 **Gradients** - Beautiful two-color gradients
  - 📄 **Content Preview** - Show note excerpts on cards
  - ⬜ **None** - Minimal cards without covers

- **Flexible Card Sizes** - Choose from small (150px), medium (200px), or large (280px) cards

- **Property Display** - Show note properties on cards using Obsidian's built-in properties toolbar

- **Grouping Support** - Organize cards by any property with vertical stacking and grid layouts

- **Responsive Grid** - Cards automatically adjust to your window size

## Requirements

- Obsidian v1.10.0 or higher (requires Bases API)

## Installation

### From Obsidian Community Plugins

1. Open Settings → Community Plugins
2. Browse and search for "Better Cards"
3. Click Install, then Enable

### Manual Installation

1. Download the latest release from the [Releases page](../../releases)
2. Extract the files into your vault's `.obsidian/plugins/better-cards/` folder
3. Reload Obsidian
4. Enable the plugin in Settings → Community Plugins

## Usage

### Creating a Better Cards View

1. Open any folder in your vault
2. Click the view type switcher (top-right of the file list)
3. Select **"Better Cards"** from the dropdown

### Configuring Your View

Use the toolbar at the top of the view to customize your cards:

- **Cover Fallback** - Choose the default cover type when notes don't have images
  - Image (shows image if available)
  - Solid Color
  - Gradient
  - Content Preview
  - None

- **Card Size** - Select small, medium, or large cards

- **Image Property** - Specify which property contains your cover images (default: `cover`)

- **Show Title** - Toggle note titles on/off

### Adding Cover Images to Notes

Add a cover image to any note by including the property in your frontmatter:

```yaml
---
cover: "[[my-image.png]]"
---
```

Supported image formats:
- Wikilinks: `[[image.png]]`
- Markdown images: `![](path/to/image.png)`
- External URLs: `https://example.com/image.jpg`
- Hex colors: `#FF5733` (displays as solid color)

### Displaying Properties on Cards

1. Click the properties icon in the toolbar
2. Select which properties you want to display
3. Properties will appear below the note title on each card

Only properties with values will be shown on the cards.

### Grouping Cards

Use Obsidian's built-in grouping feature:

1. Click the group icon in the toolbar
2. Select a property to group by (e.g., status, category, tags)
3. Cards will be organized into vertical groups

## Development

### Setup

```bash
# Install dependencies
npm install

# Start development mode (watch for changes)
npm run dev

# Build for production
npm run build
```

### Project Structure

```
src/
├── main.ts                 # Plugin entry point
├── views/
│   └── BetterCardsView.ts  # Main view controller
├── components/
│   └── Card.ts             # Card rendering logic
├── covers/
│   ├── CoverResolver.ts    # Cover type dispatcher
│   ├── ColorCover.ts       # Solid color renderer
│   ├── GradientCover.ts    # Gradient renderer
│   ├── ContentPreview.ts   # Content preview renderer
│   └── palettes.ts         # Color palette data
└── styles.css              # Plugin styles
```

### Architecture

Better Cards uses Obsidian's Bases API (v1.10.0+) to create a custom view type. The plugin:

- Registers a custom view via `registerBasesView()`
- Extends `BasesView` for lifecycle management
- Uses Obsidian's property system for configuration
- Implements conditional rendering based on grouping state
- Delegates cover rendering to specialized components

See [CLAUDE.md](./CLAUDE.md) for detailed architecture documentation.

## License

[MIT](LICENSE)

## Author

Created by [@caeochoa](https://github.com/caeochoa)

## Support

If you encounter any issues or have feature requests, please [open an issue](../../issues) on GitHub.
