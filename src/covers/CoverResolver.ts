import { App, TFile } from "obsidian";
import { renderColorCover } from "./ColorCover";
import { renderGradientCover } from "./GradientCover";
import { renderContentPreview } from "./ContentPreview";

export interface CoverOptions {
	imageUrl: string | null;
	fallbackType: string;
	noteName: string;
	file: TFile;
	imageFit: string;
}

export function resolveCover(
	app: App,
	coverEl: HTMLElement,
	options: CoverOptions
): void {
	// If we have an image URL, use it
	if (options.imageUrl) {
		renderImageCover(coverEl, options.imageUrl, options.imageFit);
		return;
	}

	// Otherwise, use the configured fallback
	switch (options.fallbackType) {
		case "color":
			renderColorCover(coverEl, options.noteName);
			break;
		case "gradient":
			renderGradientCover(coverEl, options.noteName);
			break;
		case "preview":
			renderContentPreview(app, coverEl, options.file);
			break;
		case "none":
		default:
			coverEl.addClass("better-cards-cover-empty");
			break;
	}
}

function renderImageCover(coverEl: HTMLElement, imageUrl: string, imageFit: string): void {
	coverEl.addClass("better-cards-cover-image");
	const img = coverEl.createEl("img", {
		attr: {
			src: imageUrl,
			alt: "",
		},
	});
	img.addClass("better-cards-cover-img");
	img.style.objectFit = imageFit;
}
