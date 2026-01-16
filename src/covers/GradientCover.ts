import { getGradientForName } from "./palettes";

export function renderGradientCover(coverEl: HTMLElement, noteName: string): void {
	const [color1, color2] = getGradientForName(noteName);

	coverEl.addClass("better-cards-cover-gradient");
	coverEl.style.background = `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
}
