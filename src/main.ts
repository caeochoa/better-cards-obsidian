import { Plugin, ViewOption } from "obsidian";
import { BetterCardsView } from "./views/BetterCardsView";

export default class BetterCardsPlugin extends Plugin {
	async onload() {
		this.registerBasesView("better-cards", {
			name: "Better Cards",
			icon: "layout-grid",
			factory: (controller, containerEl) => {
				return new BetterCardsView(controller, containerEl);
			},
			options: (): ViewOption[] => {
				return [
					{
						key: "coverFallback",
						displayName: "Cover fallback",
						type: "dropdown",
						default: "gradient",
						options: {
							"none": "None",
							"color": "Solid color",
							"gradient": "Gradient",
							"preview": "Content preview",
						},
					},
					{
						key: "cardSize",
						displayName: "Card size",
						type: "slider",
						default: 200,
						min: 100,
						max: 400,
						step: 10,
					},
					{
						key: "imageProperty",
						displayName: "Image property",
						type: "property",
						default: "",
					},
					{
						key: "imageFit",
						displayName: "Image fit",
						type: "dropdown",
						default: "cover",
						options: {
							"cover": "Cover",
							"contain": "Contain",
						},
					},
					{
						key: "imageAspectRatio",
						displayName: "Image aspect ratio",
						type: "slider",
						default: 1.6,
						min: 0.5,
						max: 2,
						step: 0.1,
					},
				];
			},
		});
	}

	onunload() {
		// Cleanup handled automatically by Obsidian
	}
}
