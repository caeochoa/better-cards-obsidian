import { describe, it, expect, beforeEach } from 'vitest';
import { resolveCover } from '../../src/covers/CoverResolver';
import { createMockElement, createMockApp, createMockTFile } from '../mocks/obsidian';

describe('CoverResolver', () => {
	let coverEl: HTMLElement;
	let mockApp: ReturnType<typeof createMockApp>;
	let mockFile: ReturnType<typeof createMockTFile>;

	beforeEach(() => {
		coverEl = createMockElement('div');
		mockApp = createMockApp();
		mockFile = createMockTFile('path/to/test-note.md');
	});

	describe('resolveCover', () => {
		describe('with imageUrl provided', () => {
			it('should render image cover when imageUrl is provided', () => {
				resolveCover(mockApp as any, coverEl, {
					imageUrl: 'https://example.com/image.jpg',
					fallbackType: 'color',
					noteName: 'test-note',
					file: mockFile as any,
					imageFit: 'cover',
				});

				expect(coverEl.classList.contains('better-cards-cover-image')).toBe(true);
				const img = coverEl.querySelector('img');
				expect(img).toBeTruthy();
				expect(img?.getAttribute('src')).toBe('https://example.com/image.jpg');
			});

			it('should apply imageFit style to image', () => {
				resolveCover(mockApp as any, coverEl, {
					imageUrl: 'https://example.com/image.jpg',
					fallbackType: 'color',
					noteName: 'test-note',
					file: mockFile as any,
					imageFit: 'contain',
				});

				const img = coverEl.querySelector('img');
				expect(img?.style.objectFit).toBe('contain');
			});

			it('should ignore fallbackType when imageUrl is provided', () => {
				resolveCover(mockApp as any, coverEl, {
					imageUrl: 'https://example.com/image.jpg',
					fallbackType: 'gradient',
					noteName: 'test-note',
					file: mockFile as any,
					imageFit: 'cover',
				});

				// Should have image class, not gradient class
				expect(coverEl.classList.contains('better-cards-cover-image')).toBe(true);
				expect(coverEl.classList.contains('better-cards-cover-gradient')).toBe(false);
			});
		});

		describe('without imageUrl (fallback)', () => {
			it('should render color cover when fallbackType is "color"', () => {
				resolveCover(mockApp as any, coverEl, {
					imageUrl: null,
					fallbackType: 'color',
					noteName: 'test-note',
					file: mockFile as any,
					imageFit: 'cover',
				});

				expect(coverEl.classList.contains('better-cards-cover-color')).toBe(true);
				expect(coverEl.style.backgroundColor).toBeTruthy();
			});

			it('should render gradient cover when fallbackType is "gradient"', () => {
				resolveCover(mockApp as any, coverEl, {
					imageUrl: null,
					fallbackType: 'gradient',
					noteName: 'test-note',
					file: mockFile as any,
					imageFit: 'cover',
				});

				expect(coverEl.classList.contains('better-cards-cover-gradient')).toBe(true);
				expect(coverEl.style.background).toContain('linear-gradient');
			});

			it('should render preview cover when fallbackType is "preview"', () => {
				// Mock the vault.cachedRead to return content
				mockApp.vault.cachedRead.mockResolvedValue('Test content for preview');

				resolveCover(mockApp as any, coverEl, {
					imageUrl: null,
					fallbackType: 'preview',
					noteName: 'test-note',
					file: mockFile as any,
					imageFit: 'cover',
				});

				expect(coverEl.classList.contains('better-cards-cover-preview')).toBe(true);
			});

			it('should render empty cover when fallbackType is "none"', () => {
				resolveCover(mockApp as any, coverEl, {
					imageUrl: null,
					fallbackType: 'none',
					noteName: 'test-note',
					file: mockFile as any,
					imageFit: 'cover',
				});

				expect(coverEl.classList.contains('better-cards-cover-empty')).toBe(true);
			});

			it('should render empty cover when fallbackType is unknown', () => {
				resolveCover(mockApp as any, coverEl, {
					imageUrl: null,
					fallbackType: 'unknown-type',
					noteName: 'test-note',
					file: mockFile as any,
					imageFit: 'cover',
				});

				expect(coverEl.classList.contains('better-cards-cover-empty')).toBe(true);
			});

			it('should pass note name to color cover renderer', () => {
				const noteName = 'specific-note-name';
				resolveCover(mockApp as any, coverEl, {
					imageUrl: null,
					fallbackType: 'color',
					noteName,
					file: mockFile as any,
					imageFit: 'cover',
				});

				// Verify the cover was rendered (we can't easily verify the exact color without more mocking)
				expect(coverEl.classList.contains('better-cards-cover-color')).toBe(true);
			});
		});

		describe('image rendering', () => {
			it('should add cover-img class to image', () => {
				resolveCover(mockApp as any, coverEl, {
					imageUrl: 'https://example.com/image.jpg',
					fallbackType: 'color',
					noteName: 'test-note',
					file: mockFile as any,
					imageFit: 'cover',
				});

				const img = coverEl.querySelector('img');
				expect(img?.classList.contains('better-cards-cover-img')).toBe(true);
			});

			it('should set empty alt attribute for image', () => {
				resolveCover(mockApp as any, coverEl, {
					imageUrl: 'https://example.com/image.jpg',
					fallbackType: 'color',
					noteName: 'test-note',
					file: mockFile as any,
					imageFit: 'cover',
				});

				const img = coverEl.querySelector('img');
				expect(img?.getAttribute('alt')).toBe('');
			});

			it('should handle different imageFit values', () => {
				const fitValues = ['cover', 'contain', 'fill', 'none', 'scale-down'];

				fitValues.forEach((fitValue) => {
					const el = createMockElement('div');
					resolveCover(mockApp as any, el, {
						imageUrl: 'https://example.com/image.jpg',
						fallbackType: 'color',
						noteName: 'test-note',
						file: mockFile as any,
						imageFit: fitValue,
					});

					const img = el.querySelector('img');
					expect(img?.style.objectFit).toBe(fitValue);
				});
			});
		});
	});
});
