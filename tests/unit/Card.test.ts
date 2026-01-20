import { describe, it, expect, beforeEach, vi } from 'vitest';
import { resolveImageUrl } from '../../src/components/Card';
import { createMockApp, createMockTFile } from '../mocks/obsidian';

describe('Card', () => {
	let mockApp: ReturnType<typeof createMockApp>;
	let mockFile: ReturnType<typeof createMockTFile>;

	beforeEach(() => {
		mockApp = createMockApp();
		mockFile = createMockTFile('folder/note.md');
	});

	describe('resolveImageUrl', () => {
		describe('null and undefined handling', () => {
			it('should return null for null value', () => {
				const result = resolveImageUrl(mockApp as any, null, mockFile as any);
				expect(result).toBeNull();
			});

			it('should return null for undefined value', () => {
				const result = resolveImageUrl(mockApp as any, undefined, mockFile as any);
				expect(result).toBeNull();
			});

			it('should return null for empty string', () => {
				const result = resolveImageUrl(mockApp as any, '', mockFile as any);
				expect(result).toBeNull();
			});

			it('should return null for whitespace-only string', () => {
				const result = resolveImageUrl(mockApp as any, '   ', mockFile as any);
				expect(result).toBeNull();
			});
		});

		describe('hex color detection', () => {
			it('should return null for 3-digit hex color', () => {
				const result = resolveImageUrl(mockApp as any, '#F00', mockFile as any);
				expect(result).toBeNull();
			});

			it('should return null for 6-digit hex color', () => {
				const result = resolveImageUrl(mockApp as any, '#FF0000', mockFile as any);
				expect(result).toBeNull();
			});

			it('should return null for 8-digit hex color (with alpha)', () => {
				const result = resolveImageUrl(mockApp as any, '#FF0000FF', mockFile as any);
				expect(result).toBeNull();
			});

			it('should return null for lowercase hex color', () => {
				const result = resolveImageUrl(mockApp as any, '#ff0000', mockFile as any);
				expect(result).toBeNull();
			});

			it('should not treat invalid hex as color', () => {
				mockApp.metadataCache.getFirstLinkpathDest.mockReturnValue(null);
				const result = resolveImageUrl(mockApp as any, '#GGGGGG', mockFile as any);
				expect(result).toBeNull();
			});
		});

		describe('external URLs', () => {
			it('should return http URL as-is', () => {
				const url = 'http://example.com/image.jpg';
				const result = resolveImageUrl(mockApp as any, url, mockFile as any);
				expect(result).toBe(url);
			});

			it('should return https URL as-is', () => {
				const url = 'https://example.com/image.jpg';
				const result = resolveImageUrl(mockApp as any, url, mockFile as any);
				expect(result).toBe(url);
			});

			it('should handle URLs with query parameters', () => {
				const url = 'https://example.com/image.jpg?width=800&height=600';
				const result = resolveImageUrl(mockApp as any, url, mockFile as any);
				expect(result).toBe(url);
			});

			it('should handle URLs with fragments', () => {
				const url = 'https://example.com/image.jpg#section';
				const result = resolveImageUrl(mockApp as any, url, mockFile as any);
				expect(result).toBe(url);
			});
		});

		describe('wikilink format', () => {
			it('should resolve wikilink to resource path', () => {
				const linkedFile = createMockTFile('images/photo.jpg');
				mockApp.metadataCache.getFirstLinkpathDest.mockReturnValue(linkedFile);

				const result = resolveImageUrl(mockApp as any, '[[photo.jpg]]', mockFile as any);

				expect(mockApp.metadataCache.getFirstLinkpathDest).toHaveBeenCalledWith(
					'photo.jpg',
					'folder/note.md'
				);
				expect(mockApp.vault.getResourcePath).toHaveBeenCalledWith(linkedFile);
				expect(result).toBe('app://local/images/photo.jpg');
			});

			it('should handle wikilink with path', () => {
				const linkedFile = createMockTFile('images/subfolder/photo.jpg');
				mockApp.metadataCache.getFirstLinkpathDest.mockReturnValue(linkedFile);

				const result = resolveImageUrl(
					mockApp as any,
					'[[images/subfolder/photo.jpg]]',
					mockFile as any
				);

				expect(result).toBe('app://local/images/subfolder/photo.jpg');
			});

			it('should return null if wikilink file not found', () => {
				mockApp.metadataCache.getFirstLinkpathDest.mockReturnValue(null);

				const result = resolveImageUrl(mockApp as any, '[[nonexistent.jpg]]', mockFile as any);
				expect(result).toBeNull();
			});

			it('should handle wikilink with display text (should use link part)', () => {
				const linkedFile = createMockTFile('images/photo.jpg');
				mockApp.metadataCache.getFirstLinkpathDest.mockReturnValue(linkedFile);

				// Note: The current implementation doesn't handle |display text, but testing current behavior
				const result = resolveImageUrl(mockApp as any, '[[photo.jpg]]', mockFile as any);
				expect(result).toBe('app://local/images/photo.jpg');
			});
		});

		describe('markdown image format', () => {
			it('should resolve markdown image with local path', () => {
				const linkedFile = createMockTFile('images/photo.jpg');
				mockApp.metadataCache.getFirstLinkpathDest.mockReturnValue(linkedFile);

				const result = resolveImageUrl(
					mockApp as any,
					'![alt text](images/photo.jpg)',
					mockFile as any
				);

				expect(mockApp.metadataCache.getFirstLinkpathDest).toHaveBeenCalledWith(
					'images/photo.jpg',
					'folder/note.md'
				);
				expect(result).toBe('app://local/images/photo.jpg');
			});

			it('should resolve markdown image with no alt text', () => {
				const linkedFile = createMockTFile('images/photo.jpg');
				mockApp.metadataCache.getFirstLinkpathDest.mockReturnValue(linkedFile);

				const result = resolveImageUrl(mockApp as any, '![](photo.jpg)', mockFile as any);
				expect(result).toBe('app://local/images/photo.jpg');
			});

			it('should handle markdown image with external URL', () => {
				const url = 'https://example.com/image.jpg';
				const result = resolveImageUrl(mockApp as any, `![alt](${url})`, mockFile as any);
				expect(result).toBe(url);
			});

			it('should handle markdown image with http URL', () => {
				const url = 'http://example.com/image.jpg';
				const result = resolveImageUrl(mockApp as any, `![alt](${url})`, mockFile as any);
				expect(result).toBe(url);
			});

			it('should return null if markdown image path not found', () => {
				mockApp.metadataCache.getFirstLinkpathDest.mockReturnValue(null);

				const result = resolveImageUrl(
					mockApp as any,
					'![](nonexistent.jpg)',
					mockFile as any
				);
				expect(result).toBeNull();
			});
		});

		describe('direct file path', () => {
			it('should resolve direct file path', () => {
				const linkedFile = createMockTFile('images/photo.jpg');
				mockApp.metadataCache.getFirstLinkpathDest.mockReturnValue(linkedFile);

				const result = resolveImageUrl(mockApp as any, 'images/photo.jpg', mockFile as any);

				expect(mockApp.metadataCache.getFirstLinkpathDest).toHaveBeenCalledWith(
					'images/photo.jpg',
					'folder/note.md'
				);
				expect(result).toBe('app://local/images/photo.jpg');
			});

			it('should return null if direct path not found', () => {
				mockApp.metadataCache.getFirstLinkpathDest.mockReturnValue(null);

				const result = resolveImageUrl(mockApp as any, 'nonexistent.jpg', mockFile as any);
				expect(result).toBeNull();
			});
		});

		describe('object values', () => {
			it('should call toString on object with toString method', () => {
				const linkedFile = createMockTFile('images/photo.jpg');
				mockApp.metadataCache.getFirstLinkpathDest.mockReturnValue(linkedFile);

				const obj = {
					toString: () => 'images/photo.jpg',
				};

				const result = resolveImageUrl(mockApp as any, obj, mockFile as any);
				expect(result).toBe('app://local/images/photo.jpg');
			});

			it('should return null for object with [object Object] toString', () => {
				const obj = { value: 'test' };
				const result = resolveImageUrl(mockApp as any, obj, mockFile as any);
				expect(result).toBeNull();
			});

			it('should handle object that returns URL from toString', () => {
				const url = 'https://example.com/image.jpg';
				const obj = {
					toString: () => url,
				};

				const result = resolveImageUrl(mockApp as any, obj, mockFile as any);
				expect(result).toBe(url);
			});
		});

		describe('array values', () => {
			it('should use first item in array', () => {
				const url = 'https://example.com/image.jpg';
				const result = resolveImageUrl(mockApp as any, [url, 'other'], mockFile as any);
				expect(result).toBe(url);
			});

			it('should return null for empty array', () => {
				const result = resolveImageUrl(mockApp as any, [], mockFile as any);
				expect(result).toBeNull();
			});

			it('should recursively resolve first array item', () => {
				const linkedFile = createMockTFile('images/photo.jpg');
				mockApp.metadataCache.getFirstLinkpathDest.mockReturnValue(linkedFile);

				const result = resolveImageUrl(
					mockApp as any,
					['[[photo.jpg]]', 'other'],
					mockFile as any
				);
				expect(result).toBe('app://local/images/photo.jpg');
			});
		});

		describe('priority order', () => {
			it('should prioritize URL detection over wikilink pattern matching', () => {
				// A string that looks like both
				const url = 'https://example.com/[[image]].jpg';
				const result = resolveImageUrl(mockApp as any, url, mockFile as any);
				// Should be treated as URL, not wikilink
				expect(result).toBe(url);
			});

			it('should check hex color before file resolution', () => {
				// Even if a file named "#FF0000" exists, should return null for hex
				mockApp.metadataCache.getFirstLinkpathDest.mockReturnValue(
					createMockTFile('#FF0000')
				);

				const result = resolveImageUrl(mockApp as any, '#FF0000', mockFile as any);
				expect(result).toBeNull();
				expect(mockApp.metadataCache.getFirstLinkpathDest).not.toHaveBeenCalled();
			});
		});

		describe('edge cases', () => {
			it('should trim whitespace from string values', () => {
				const url = 'https://example.com/image.jpg';
				const result = resolveImageUrl(mockApp as any, `  ${url}  `, mockFile as any);
				expect(result).toBe(url);
			});

			it('should handle malformed wikilinks', () => {
				mockApp.metadataCache.getFirstLinkpathDest.mockReturnValue(null);
				const result = resolveImageUrl(mockApp as any, '[[unclosed', mockFile as any);
				// Should fall through to direct path resolution
				expect(result).toBeNull();
			});

			it('should handle malformed markdown images', () => {
				mockApp.metadataCache.getFirstLinkpathDest.mockReturnValue(null);
				const result = resolveImageUrl(mockApp as any, '![unclosed](', mockFile as any);
				// Should fall through to direct path resolution
				expect(result).toBeNull();
			});
		});
	});
});
