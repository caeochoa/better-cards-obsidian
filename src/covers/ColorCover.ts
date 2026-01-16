import { getColorForName } from "./palettes";

export function renderColorCover(coverEl: HTMLElement, noteName: string): void {
	const color = getColorForName(noteName);

	coverEl.addClass("better-cards-cover-color");
	coverEl.style.backgroundColor = color;
}
