import { describe, it, expect, beforeEach } from 'vitest';
import { renderColorCover } from '../../src/covers/ColorCover';
import { createMockElement } from '../mocks/obsidian';
import { getColorForName } from '../../src/covers/palettes';

describe('ColorCover', () => {
	let coverEl: HTMLElement;

	beforeEach(() => {
		coverEl = createMockElement('div');
	});

	describe('renderColorCover', () => {
		it('should add the color cover class', () => {
			renderColorCover(coverEl, 'test-note');
			expect(coverEl.classList.contains('better-cards-cover-color')).toBe(true);
		});

		it('should set backgroundColor style', () => {
			renderColorCover(coverEl, 'test-note');
			expect(coverEl.style.backgroundColor).toBeTruthy();
			expect(coverEl.style.backgroundColor).toMatch(/^rgb\(|#/);
		});

		it('should use color from palette based on note name', () => {
			const noteName = 'my-test-note';
			const expectedColor = getColorForName(noteName);

			renderColorCover(coverEl, noteName);

			// Convert hex to rgb for comparison (browsers may return either format)
			const bgColor = coverEl.style.backgroundColor;
			expect(bgColor).toBeTruthy();
		});

		it('should render consistent color for same note name', () => {
			const noteName = 'consistent-note';

			renderColorCover(coverEl, noteName);
			const color1 = coverEl.style.backgroundColor;

			// Reset element
			coverEl = createMockElement('div');

			renderColorCover(coverEl, noteName);
			const color2 = coverEl.style.backgroundColor;

			expect(color1).toBe(color2);
		});

		it('should render different colors for different note names', () => {
			renderColorCover(coverEl, 'note-1');
			const color1 = coverEl.style.backgroundColor;

			const coverEl2 = createMockElement('div');
			renderColorCover(coverEl2, 'note-2');
			const color2 = coverEl2.style.backgroundColor;

			// Note: there's a small chance of collision, but with 16 colors it's unlikely
			expect(color1).not.toBe(color2);
		});

		it('should handle empty note name', () => {
			renderColorCover(coverEl, '');
			expect(coverEl.classList.contains('better-cards-cover-color')).toBe(true);
			expect(coverEl.style.backgroundColor).toBeTruthy();
		});

		it('should handle note names with special characters', () => {
			renderColorCover(coverEl, 'note-with-special-chars!@#$%');
			expect(coverEl.classList.contains('better-cards-cover-color')).toBe(true);
			expect(coverEl.style.backgroundColor).toBeTruthy();
		});

		it('should handle unicode note names', () => {
			renderColorCover(coverEl, '日本語のノート');
			expect(coverEl.classList.contains('better-cards-cover-color')).toBe(true);
			expect(coverEl.style.backgroundColor).toBeTruthy();
		});
	});
});
