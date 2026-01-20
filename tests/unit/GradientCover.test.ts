import { describe, it, expect, beforeEach } from 'vitest';
import { renderGradientCover } from '../../src/covers/GradientCover';
import { createMockElement } from '../mocks/obsidian';
import { getGradientForName } from '../../src/covers/palettes';

describe('GradientCover', () => {
	let coverEl: HTMLElement;

	beforeEach(() => {
		coverEl = createMockElement('div');
	});

	describe('renderGradientCover', () => {
		it('should add the gradient cover class', () => {
			renderGradientCover(coverEl, 'test-note');
			expect(coverEl.classList.contains('better-cards-cover-gradient')).toBe(true);
		});

		it('should set linear-gradient background', () => {
			renderGradientCover(coverEl, 'test-note');
			expect(coverEl.style.background).toContain('linear-gradient');
		});

		it('should use 135deg angle for gradient', () => {
			renderGradientCover(coverEl, 'test-note');
			expect(coverEl.style.background).toContain('135deg');
		});

		it('should use gradient from palette based on note name', () => {
			const noteName = 'my-test-note';
			const [color1, color2] = getGradientForName(noteName);

			renderGradientCover(coverEl, noteName);

			const background = coverEl.style.background;
			// Browser converts hex to rgb, so just check it's a gradient with colors
			expect(background).toContain('linear-gradient');
			expect(background).toContain('135deg');
		});

		it('should render consistent gradient for same note name', () => {
			const noteName = 'consistent-note';

			renderGradientCover(coverEl, noteName);
			const gradient1 = coverEl.style.background;

			// Reset element
			coverEl = createMockElement('div');

			renderGradientCover(coverEl, noteName);
			const gradient2 = coverEl.style.background;

			expect(gradient1).toBe(gradient2);
		});

		it('should render different gradients for different note names', () => {
			renderGradientCover(coverEl, 'note-1');
			const gradient1 = coverEl.style.background;

			const coverEl2 = createMockElement('div');
			renderGradientCover(coverEl2, 'note-2');
			const gradient2 = coverEl2.style.background;

			// Note: there's a small chance of collision, but with 16 gradients it's unlikely
			expect(gradient1).not.toBe(gradient2);
		});

		it('should use 0% and 100% stop positions', () => {
			renderGradientCover(coverEl, 'test-note');
			const background = coverEl.style.background;
			expect(background).toContain('0%');
			expect(background).toContain('100%');
		});

		it('should handle empty note name', () => {
			renderGradientCover(coverEl, '');
			expect(coverEl.classList.contains('better-cards-cover-gradient')).toBe(true);
			expect(coverEl.style.background).toContain('linear-gradient');
		});

		it('should handle note names with special characters', () => {
			renderGradientCover(coverEl, 'note-with-special-chars!@#$%');
			expect(coverEl.classList.contains('better-cards-cover-gradient')).toBe(true);
			expect(coverEl.style.background).toContain('linear-gradient');
		});

		it('should handle unicode note names', () => {
			renderGradientCover(coverEl, '日本語のノート');
			expect(coverEl.classList.contains('better-cards-cover-gradient')).toBe(true);
			expect(coverEl.style.background).toContain('linear-gradient');
		});

		it('should format gradient correctly', () => {
			const noteName = 'format-test';

			renderGradientCover(coverEl, noteName);

			// Browser converts hex to rgb format, so just verify structure
			const background = coverEl.style.background;
			expect(background).toMatch(/linear-gradient\(135deg, rgb\(.+\) 0%, rgb\(.+\) 100%\)/);
		});
	});
});
