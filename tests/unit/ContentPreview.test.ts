import { describe, it, expect } from 'vitest';
import { getContentExcerpt } from '../../src/covers/ContentPreview';

describe('ContentPreview', () => {
	describe('getContentExcerpt', () => {
		it('should remove frontmatter from content', () => {
			const content = `---
title: My Note
tags: [test, example]
---

This is the actual content.`;
			const result = getContentExcerpt(content, 100);
			expect(result).not.toContain('---');
			expect(result).not.toContain('title:');
			expect(result).toContain('This is the actual content.');
		});

		it('should return full content if shorter than maxLength', () => {
			const content = 'Short content';
			const result = getContentExcerpt(content, 100);
			expect(result).toBe('Short content');
		});

		it('should truncate at paragraph break when available', () => {
			const content = `First paragraph is here and it is longer.

Second paragraph is here.

Third paragraph is here.`;
			const result = getContentExcerpt(content, 60);
			// maxLength=60, so slice to 60 chars gets first para + part of second
			// lastParagraph at position 43 (the \n\n after first para) which is > 30 (60 * 0.5)
			// Returns up to position 43
			expect(result).toBe('First paragraph is here and it is longer.');
		});

		it('should truncate at sentence break when paragraph break not available', () => {
			const content = 'First sentence here. Second sentence. Third sentence. Fourth sentence.';
			const result = getContentExcerpt(content, 50);
			// Should break at sentence (position 20, which is < 25 = 50 * 0.5, so next sentence at 37 which is > 25)
			expect(result).toBe('First sentence here. Second sentence.');
		});

		it('should handle exclamation marks as sentence breaks', () => {
			const content = 'Exciting sentence! Another sentence. More content here.';
			const result = getContentExcerpt(content, 30);
			expect(result).toBe('Exciting sentence!');
		});

		it('should handle question marks as sentence breaks', () => {
			const content = 'A longer question here? Another sentence. More content here.';
			const result = getContentExcerpt(content, 40);
			// Should break at sentence (position 23, which is > 20 = 40 * 0.5)
			expect(result).toBe('A longer question here?');
		});

		it('should truncate at word boundary when no sentence break available', () => {
			const content = 'This is a very long single sentence without any punctuation marks at all';
			const result = getContentExcerpt(content, 30);
			expect(result).toContain('...');
			expect(result.length).toBeLessThanOrEqual(34); // 30 + "..."
			// Should not cut in middle of word
			expect(result).toMatch(/\w+\.\.\.$/);
		});

		it('should trim whitespace from content', () => {
			const content = '   \n\n  Content with whitespace  \n\n  ';
			const result = getContentExcerpt(content, 100);
			expect(result).toBe('Content with whitespace');
		});

		it('should handle content with only frontmatter', () => {
			const content = `---
title: Empty Note
---
`;
			const result = getContentExcerpt(content, 100);
			expect(result).toBe('');
		});

		it('should handle empty content', () => {
			const result = getContentExcerpt('', 100);
			expect(result).toBe('');
		});

		it('should handle content without frontmatter', () => {
			const content = 'Just regular content without any frontmatter.';
			const result = getContentExcerpt(content, 100);
			expect(result).toBe('Just regular content without any frontmatter.');
		});

		it('should prefer paragraph break over sentence break', () => {
			const content = `First paragraph with sentence. Another sentence.

Second paragraph.`;
			const result = getContentExcerpt(content, 60);
			expect(result).toBe('First paragraph with sentence. Another sentence.');
		});

		it('should add ellipsis only when breaking at word boundary', () => {
			const content = 'This is some content.';
			const result = getContentExcerpt(content, 30);
			// Should break at sentence, no ellipsis
			expect(result).toBe('This is some content.');
			expect(result).not.toContain('...');
		});

		it('should handle very short maxLength', () => {
			const content = 'This is a longer piece of content that needs truncation';
			const result = getContentExcerpt(content, 10);
			// Should break at word if possible
			expect(result.length).toBeLessThanOrEqual(14); // 10 + "..."
		});

		it('should handle content with multiple paragraph breaks', () => {
			const content = `Paragraph one is longer to reach threshold.

Paragraph two.

Paragraph three.`;
			const result = getContentExcerpt(content, 60);
			// Should break at paragraph (position 45, which is > 30 = 60 * 0.5)
			expect(result).toBe('Paragraph one is longer to reach threshold.');
		});

		it('should handle markdown formatting in content', () => {
			const content = '**Bold text** and *italic text* and `code`.';
			const result = getContentExcerpt(content, 100);
			expect(result).toContain('**Bold text**');
			expect(result).toContain('*italic text*');
			expect(result).toContain('`code`');
		});

		it('should handle content with only whitespace after frontmatter', () => {
			const content = `---
title: Test
---


   `;
			const result = getContentExcerpt(content, 100);
			expect(result).toBe('');
		});

		it('should respect 50% threshold for paragraph breaks', () => {
			// If paragraph break is < 50% of maxLength, don't use it
			const content = `Short.

This is a much longer paragraph that goes well beyond the maxLength specified.`;
			const result = getContentExcerpt(content, 20);
			// Should not break at "Short." since it's < 50% (10 chars) of maxLength (20)
			expect(result.length).toBeGreaterThan(10);
		});

		it('should respect 50% threshold for sentence breaks', () => {
			const content = `Short. This is a much longer sentence that continues for quite a while.`;
			const result = getContentExcerpt(content, 20);
			// Should not break at "Short." since it's < 50% (10 chars) of maxLength (20)
			expect(result.length).toBeGreaterThan(10);
		});

		it('should respect 70% threshold for word breaks', () => {
			const content = 'One two three four five six seven eight nine ten eleven twelve';
			const result = getContentExcerpt(content, 30);
			// Word break should be > 70% (21 chars) of maxLength (30)
			expect(result.length).toBeGreaterThan(21);
			expect(result).toContain('...');
		});
	});
});
