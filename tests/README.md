# Testing

This directory contains unit tests for the Better Cards plugin that run **without requiring Obsidian**.

## Overview

The test suite uses:
- **Vitest** - Fast unit test framework
- **jsdom** - DOM implementation for testing DOM manipulation
- **Mock factories** - Custom mocks for Obsidian API types

## Installation

When installing dependencies for the first time, you may need to use:

```bash
npm install --legacy-peer-deps
```

This is due to peer dependency conflicts between vitest/jsdom and other dependencies.

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

```
tests/
├── setup.ts                 # Test environment setup
├── mocks/
│   ├── obsidian.ts          # Mock factories for Obsidian types
│   └── obsidian-stub.ts     # Stub module that replaces 'obsidian' import
└── unit/
    ├── palettes.test.ts     # Tests for color/gradient selection
    ├── ContentPreview.test.ts   # Tests for content excerpt logic
    ├── ColorCover.test.ts   # Tests for solid color covers
    ├── GradientCover.test.ts    # Tests for gradient covers
    ├── CoverResolver.test.ts    # Tests for cover type resolution
    └── Card.test.ts         # Tests for card rendering & image URL resolution
```

## What's Tested

### Pure Functions (100% coverage possible)
- `hashString()`, `getColorForName()`, `getGradientForName()` - Color/gradient selection
- `getContentExcerpt()` - Text truncation and frontmatter removal

### DOM Rendering (mocked DOM)
- `renderColorCover()` - Solid color background rendering
- `renderGradientCover()` - Gradient background rendering
- `resolveCover()` - Cover type selection logic

### Business Logic (with mocks)
- `resolveImageUrl()` - URL parsing, wikilink/markdown image detection
- Cover fallback behavior

## What's NOT Tested

These require Obsidian to be running:
- `BetterCardsView` class (Bases API integration)
- Full `MarkdownRenderer` behavior
- Real vault file operations
- Actual note linking/resolution

## Mock System

### Creating Mock Elements

```typescript
import { createMockElement } from '../mocks/obsidian';

const element = createMockElement('div');
element.addClass('my-class');  // Obsidian API method
element.createDiv({ cls: 'child' });  // Works like real Obsidian
```

### Creating Mock Obsidian Objects

```typescript
import { createMockApp, createMockTFile } from '../mocks/obsidian';

const mockApp = createMockApp();
const mockFile = createMockTFile('path/to/note.md');

// Configure mock behavior
mockApp.metadataCache.getFirstLinkpathDest.mockReturnValue(mockFile);
```

## Benefits

1. **Fast** - Tests run in ~5 seconds without starting Obsidian
2. **Isolated** - No vault or Obsidian installation needed
3. **CI-friendly** - Can run in GitHub Actions
4. **High coverage** - ~70-80% of codebase is testable
5. **Better design** - Encourages separation of concerns

## Writing New Tests

1. Create a new file in `tests/unit/`
2. Import functions to test from `src/`
3. Use mock factories from `tests/mocks/obsidian`
4. Write tests using Vitest's `describe`, `it`, `expect`

Example:
```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../../src/myModule';
import { createMockApp } from '../mocks/obsidian';

describe('myFunction', () => {
  it('should do something', () => {
    const mockApp = createMockApp();
    const result = myFunction(mockApp as any);
    expect(result).toBe('expected value');
  });
});
```

## Notes

- The `obsidian` module is aliased to `tests/mocks/obsidian-stub.ts` in vitest config
- Mock HTMLElements have Obsidian helper methods (`.addClass()`, `.createDiv()`, etc.)
- Use `.mockReturnValue()` and `.mockResolvedValue()` to configure mock behavior
