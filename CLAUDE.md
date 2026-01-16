# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Better Cards is an Obsidian plugin that provides a custom Bases view for displaying notes as cards with enhanced cover options. It extends Obsidian's built-in Bases API (introduced in v1.10.0) to create a Pinterest-style card grid view.

**Key Features:**
- Multiple cover types: images, solid colors, gradients, content previews, or none
- Configurable card sizes (small, medium, large)
- Property display on cards (configured through Obsidian's properties toolbar)
- Grouping support (vertical stacking with grid layout inside groups)

## Build Commands

```bash
# Development mode with watch
npm run dev

# Production build
npm run build

# The build runs TypeScript type checking followed by esbuild bundling
# Output: main.js (bundled plugin file)
```

## Architecture

### Plugin Structure

The plugin follows Obsidian's Bases API pattern for custom views:

1. **`src/main.ts`** - Plugin entry point
   - Registers the "better-cards" view type via `registerBasesView()`
   - Defines view options (coverFallback, cardSize, imageProperty, showTitle)
   - Factory function creates BetterCardsView instances

2. **`src/views/BetterCardsView.ts`** - Main view controller
   - Extends `BasesView` from Obsidian API
   - Implements `onDataUpdated()` lifecycle method
   - Handles grouping logic: detects if grouping is active via `data.groupedData[0].hasKey()`
   - When grouped: uses `.better-cards-container` wrapper (groups stack vertically)
   - When ungrouped: uses `.better-cards-grid` with size classes (cards in grid)
   - Delegates card rendering to `Card.ts`

3. **`src/components/Card.ts`** - Card rendering logic
   - `renderCard()` creates the card DOM structure
   - Reads properties to display via `config.getOrder()` (from Obsidian's properties toolbar)
   - Uses `config.getDisplayName()` for property labels
   - Uses `entry.getValue()` to get property values
   - Delegates to CoverResolver for cover rendering
   - `resolveImageUrl()` handles multiple image formats: URLs, wikilinks `[[]]`, markdown images `![]()`, hex colors

### Cover System

The cover system is modular with a resolver pattern:

**`src/covers/CoverResolver.ts`**
- Central dispatcher for cover types
- Checks for image first, then fallback to configured type
- Delegates to specialized renderers

**Cover Renderers:**
- `ColorCover.ts` - Solid color based on note name hash
- `GradientCover.ts` - Two-color gradient based on note name hash
- `ContentPreview.ts` - Shows note excerpt with smart truncation (removes frontmatter, breaks at paragraph/sentence/word)
- `palettes.ts` - Color palette data for color/gradient covers

### Obsidian Bases API Integration

**Key API Methods Used:**
- `this.config.getOrder()` - Returns `BasesPropertyId[]` of properties selected by user
- `this.config.getDisplayName(propertyId)` - Returns friendly property name
- `this.config.getAsPropertyId(key)` - Converts config key to property ID
- `entry.getValue(propertyId)` - Returns property value as `Value` object
- `value.isTruthy()` - Check if value is non-empty
- `value.toString()` - Convert value to display string
- `this.data.groupedData` - Array of groups (always present, single group when no grouping)
- `group.hasKey()` - Returns true if grouping is active

**View Configuration:**
Properties are configured in `main.ts` options array and read via `this.config.get(key)` in the view.

### Grouping Behavior

The view conditionally applies CSS classes based on grouping state:

```typescript
const hasGrouping = this.data.groupedData.length > 0 &&
                    this.data.groupedData[0].hasKey();

// No grid class when grouping (allows vertical stacking)
const containerEl = this.containerEl.createDiv({
    cls: hasGrouping
        ? "better-cards-container"
        : `better-cards-grid better-cards-size-${cardSize}`,
});
```

- **When grouped:** Groups stack vertically as rows; each group has its own grid for cards
- **When ungrouped:** All cards in a single responsive grid

### CSS Structure

`styles.css` defines:
- `.better-cards-grid` - CSS grid with responsive columns via `repeat(auto-fill, minmax(...))`
- `.better-cards-size-*` - Card size variants (small: 150px, medium: 200px, large: 280px)
- `.better-cards-container` - Simple wrapper for grouped view (no grid)
- `.better-cards-group` - Group wrapper with vertical margin
- `.better-cards-card` - Individual card with hover effects
- `.better-cards-cover` - Fixed aspect ratio (16/10) cover area
- `.better-cards-properties` - Property display below title

## Important Patterns

### Image URL Resolution Priority

`Card.ts` resolves image properties in this order:
1. External URLs (http/https)
2. Wikilinks `[[image.png]]`
3. Markdown images `![](path)`
4. Direct file paths
5. Hex color codes (returned as null, handled by CoverResolver)

### Property Display

Only properties with truthy values are shown. The plugin uses Obsidian's built-in property selection UI (properties toolbar menu) rather than custom configuration.

### Note Opening

Cards handle click events to open notes with Ctrl/Cmd+click for new tab support.
