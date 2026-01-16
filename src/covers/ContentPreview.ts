import { App, MarkdownRenderer, TFile, Component } from "obsidian";

export function renderContentPreview(
	app: App,
	coverEl: HTMLElement,
	file: TFile
): void {
	coverEl.addClass("better-cards-cover-preview");

	const previewContainer = coverEl.createDiv({ cls: "better-cards-preview-content" });

	// Read file and render asynchronously
	app.vault.cachedRead(file).then((content) => {
		const excerpt = getContentExcerpt(content, 500);

		if (excerpt) {
			// Create a temporary component for the renderer
			const component = new Component();
			component.load();

			MarkdownRenderer.render(
				app,
				excerpt,
				previewContainer,
				file.path,
				component
			).catch((error) => {
				console.error("Failed to render content preview:", error);
				previewContainer.addClass("better-cards-preview-empty");
			});
		} else {
			previewContainer.addClass("better-cards-preview-empty");
		}
	}).catch((error) => {
		console.error("Failed to read file for preview:", error);
		previewContainer.addClass("better-cards-preview-empty");
	});
}

function getContentExcerpt(content: string, maxLength: number): string {
	// Remove frontmatter
	const frontmatterMatch = content.match(/^---\n[\s\S]*?\n---\n/);
	if (frontmatterMatch) {
		content = content.slice(frontmatterMatch[0].length);
	}

	// Trim whitespace
	content = content.trim();

	// Take first N characters, trying to break at a reasonable point
	if (content.length <= maxLength) {
		return content;
	}

	// Find a good break point (end of paragraph, sentence, or word)
	let excerpt = content.slice(0, maxLength);

	// Try to break at paragraph
	const lastParagraph = excerpt.lastIndexOf("\n\n");
	if (lastParagraph > maxLength * 0.5) {
		return excerpt.slice(0, lastParagraph);
	}

	// Try to break at sentence
	const lastSentence = Math.max(
		excerpt.lastIndexOf(". "),
		excerpt.lastIndexOf("! "),
		excerpt.lastIndexOf("? ")
	);
	if (lastSentence > maxLength * 0.5) {
		return excerpt.slice(0, lastSentence + 1);
	}

	// Break at word
	const lastSpace = excerpt.lastIndexOf(" ");
	if (lastSpace > maxLength * 0.7) {
		return excerpt.slice(0, lastSpace) + "...";
	}

	return excerpt + "...";
}
