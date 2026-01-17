import { describe, it, expect } from 'vitest';
import {
	hashString,
	getColorForName,
	getGradientForName,
	SOLID_COLORS,
	GRADIENTS,
} from '../../src/covers/palettes';

describe('palettes', () => {
	describe('hashString', () => {
		it('should return a non-negative integer', () => {
			const result = hashString('test');
			expect(result).toBeGreaterThanOrEqual(0);
			expect(Number.isInteger(result)).toBe(true);
		});

		it('should return consistent hash for same input', () => {
			const input = 'my-note-name';
			const hash1 = hashString(input);
			const hash2 = hashString(input);
			expect(hash1).toBe(hash2);
		});

		it('should return different hashes for different inputs', () => {
			const hash1 = hashString('note1');
			const hash2 = hashString('note2');
			expect(hash1).not.toBe(hash2);
		});

		it('should handle empty string', () => {
			const result = hashString('');
			expect(result).toBe(0);
		});

		it('should handle special characters', () => {
			const result = hashString('note-with-special-chars!@#$%');
			expect(result).toBeGreaterThanOrEqual(0);
			expect(Number.isInteger(result)).toBe(true);
		});

		it('should handle unicode characters', () => {
			const result = hashString('日本語のノート');
			expect(result).toBeGreaterThanOrEqual(0);
			expect(Number.isInteger(result)).toBe(true);
		});
	});

	describe('getColorForName', () => {
		it('should return a color from SOLID_COLORS palette', () => {
			const color = getColorForName('test-note');
			expect(SOLID_COLORS).toContain(color);
		});

		it('should return consistent color for same name', () => {
			const name = 'my-note';
			const color1 = getColorForName(name);
			const color2 = getColorForName(name);
			expect(color1).toBe(color2);
		});

		it('should return valid hex color format', () => {
			const color = getColorForName('test');
			expect(color).toMatch(/^#[0-9A-F]{6}$/i);
		});

		it('should distribute different names across palette', () => {
			const colors = new Set();
			for (let i = 0; i < SOLID_COLORS.length * 2; i++) {
				colors.add(getColorForName(`note-${i}`));
			}
			// Should have used multiple colors (at least 50% of palette)
			expect(colors.size).toBeGreaterThanOrEqual(SOLID_COLORS.length / 2);
		});
	});

	describe('getGradientForName', () => {
		it('should return a gradient from GRADIENTS palette', () => {
			const [color1, color2] = getGradientForName('test-note');
			const gradientFound = GRADIENTS.some(
				([c1, c2]) => c1 === color1 && c2 === color2
			);
			expect(gradientFound).toBe(true);
		});

		it('should return consistent gradient for same name', () => {
			const name = 'my-note';
			const gradient1 = getGradientForName(name);
			const gradient2 = getGradientForName(name);
			expect(gradient1).toEqual(gradient2);
		});

		it('should return array of two hex colors', () => {
			const [color1, color2] = getGradientForName('test');
			expect(color1).toMatch(/^#[0-9A-Fa-f]{6}$/);
			expect(color2).toMatch(/^#[0-9A-Fa-f]{6}$/);
		});

		it('should distribute different names across palette', () => {
			const gradients = new Set();
			for (let i = 0; i < GRADIENTS.length * 2; i++) {
				const [c1, c2] = getGradientForName(`note-${i}`);
				gradients.add(`${c1}-${c2}`);
			}
			// Should have used multiple gradients (at least 50% of palette)
			expect(gradients.size).toBeGreaterThanOrEqual(GRADIENTS.length / 2);
		});
	});

	describe('palette data', () => {
		it('SOLID_COLORS should contain valid hex colors', () => {
			SOLID_COLORS.forEach((color) => {
				expect(color).toMatch(/^#[0-9A-F]{6}$/i);
			});
		});

		it('SOLID_COLORS should have at least 10 colors', () => {
			expect(SOLID_COLORS.length).toBeGreaterThanOrEqual(10);
		});

		it('GRADIENTS should contain pairs of valid hex colors', () => {
			GRADIENTS.forEach(([color1, color2]) => {
				expect(color1).toMatch(/^#[0-9A-Fa-f]{6}$/);
				expect(color2).toMatch(/^#[0-9A-Fa-f]{6}$/);
			});
		});

		it('GRADIENTS should have at least 10 gradients', () => {
			expect(GRADIENTS.length).toBeGreaterThanOrEqual(10);
		});
	});
});
