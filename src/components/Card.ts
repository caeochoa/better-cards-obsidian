import { App, BasesEntry, BasesPropertyId, BasesViewConfig, TFile } from "obsidian";
import { resolveCover } from "../covers/CoverResolver";

export interface CardOptions {
	coverFallback: string;
	imagePropertyId: BasesPropertyId | null;
	imageFit: string;
	displayPropertyIds: BasesPropertyId[];
	config: BasesViewConfig;
}

export function renderCard(
	app: App,
	cardEl: HTMLElement,
	entry: BasesEntry,
	options: CardOptions
): void {
	const file = entry.file;
	if (!file) return;

	// Create cover container
	const coverEl = cardEl.createDiv({ cls: "better-cards-cover" });

	// Try to get image from property
	let imageUrl: string | null = null;
	if (options.imagePropertyId) {
		const imageValue = entry.getValue(options.imagePropertyId);
		if (imageValue) {
			imageUrl = resolveImageUrl(app, imageValue, file);
		}
	}

	// Render cover (image or fallback)
	resolveCover(app, coverEl, {
		imageUrl,
		fallbackType: options.coverFallback,
		noteName: file.basename,
		file,
		imageFit: options.imageFit,
	});

	// Create content container
	const contentEl = cardEl.createDiv({ cls: "better-cards-content" });

	// Render title from first property (if available), otherwise use file basename
	const titleEl = contentEl.createDiv({ cls: "better-cards-title" });
	if (options.displayPropertyIds.length > 0) {
		const firstPropId = options.displayPropertyIds[0];
		const firstValue = entry.getValue(firstPropId);
		const firstStrValue = firstValue !== null && firstValue !== undefined ? firstValue.toString() : "";
		if (firstStrValue !== "") {
			titleEl.setText(firstStrValue);
		} else {
			titleEl.setText(file.basename);
		}
	} else {
		titleEl.setText(file.basename);
	}

	// Render remaining properties (skip first one since it's used as title)
	if (options.displayPropertyIds.length > 1) {
		const propsEl = contentEl.createDiv({ cls: "better-cards-properties" });
		for (let i = 1; i < options.displayPropertyIds.length; i++) {
			const propId = options.displayPropertyIds[i];
			const value = entry.getValue(propId);
			// Show property if value exists (not null/undefined) - don't use isTruthy() as it filters out 0
			if (value !== null && value !== undefined) {
				const strValue = value.toString();
				if (strValue !== "") {
					const propEl = propsEl.createDiv({ cls: "better-cards-property" });
					const displayName = options.config.getDisplayName(propId);
					const labelEl = propEl.createSpan({ cls: "better-cards-property-label" });
					labelEl.setText(displayName + ":");
					const valueEl = propEl.createSpan({ cls: "better-cards-property-value" });
					valueEl.setText(strValue);
				}
			}
		}
	}
}

function resolveImageUrl(
	app: App,
	value: unknown,
	contextFile: TFile
): string | null {
	if (!value) return null;

	// Handle string values
	if (typeof value === "string") {
		const str = value.trim();

		// Check if it's a hex color code
		if (str.match(/^#[0-9a-fA-F]{3,8}$/)) {
			return null; // We'll handle hex colors in the cover resolver
		}

		// Check if it's an external URL
		if (str.startsWith("http://") || str.startsWith("https://")) {
			return str;
		}

		// Check if it's a wiki-link format [[image.png]]
		const wikiLinkMatch = str.match(/^\[\[([^\]]+)\]\]$/);
		if (wikiLinkMatch) {
			const linkedFile = app.metadataCache.getFirstLinkpathDest(
				wikiLinkMatch[1],
				contextFile.path
			);
			if (linkedFile) {
				return app.vault.getResourcePath(linkedFile);
			}
		}

		// Check if it's a markdown image format ![](image.png)
		const mdImageMatch = str.match(/^!\[[^\]]*\]\(([^)]+)\)$/);
		if (mdImageMatch) {
			const imagePath = mdImageMatch[1];
			if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
				return imagePath;
			}
			const linkedFile = app.metadataCache.getFirstLinkpathDest(
				imagePath,
				contextFile.path
			);
			if (linkedFile) {
				return app.vault.getResourcePath(linkedFile);
			}
		}

		// Try as a direct file path
		const linkedFile = app.metadataCache.getFirstLinkpathDest(
			str,
			contextFile.path
		);
		if (linkedFile) {
			return app.vault.getResourcePath(linkedFile);
		}
	}

	// Handle Value objects (Obsidian's internal value type)
	if (value && typeof value === "object") {
		// Check if it has a toString or value property
		const objValue = value as Record<string, unknown>;
		if (typeof objValue.toString === "function") {
			const strValue = objValue.toString();
			if (strValue && strValue !== "[object Object]") {
				return resolveImageUrl(app, strValue, contextFile);
			}
		}
	}

	// Handle array values (take first item)
	if (Array.isArray(value) && value.length > 0) {
		return resolveImageUrl(app, value[0], contextFile);
	}

	return null;
}
