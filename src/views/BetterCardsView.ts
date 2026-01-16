import { BasesView, BasesEntry, QueryController, BasesViewConfig } from "obsidian";
import { renderCard } from "../components/Card";

export class BetterCardsView extends BasesView {
	type = "better-cards";
	private containerEl: HTMLElement;

	constructor(controller: QueryController, containerEl: HTMLElement) {
		super(controller);
		this.containerEl = containerEl;
	}

	onDataUpdated(): void {
		this.containerEl.empty();

		const cardSize = (this.config.get("cardSize") as number) || 200;
		const coverFallback = (this.config.get("coverFallback") as string) || "gradient";
		const imagePropertyId = this.config.getAsPropertyId("imageProperty");
		const imageFit = (this.config.get("imageFit") as string) || "cover";
		const imageAspectRatio = (this.config.get("imageAspectRatio") as number) || 1.6;
		const displayPropertyIds = this.config.getOrder();

		// Check if grouping is active
		const hasGrouping = this.data.groupedData.length > 0 &&
			this.data.groupedData[0].hasKey();

		const containerEl = this.containerEl.createDiv({
			cls: hasGrouping
				? "better-cards-container"
				: "better-cards-grid",
		});
		containerEl.style.setProperty("--card-size", `${cardSize}px`);
		containerEl.style.setProperty("--image-aspect-ratio", `${imageAspectRatio}`);

		// Always use groupedData - it returns a single group if no groupBy is set
		for (const group of this.data.groupedData) {
			// Only show group header if there's actually a groupBy key
			if (group.hasKey()) {
				const groupEl = containerEl.createDiv({ cls: "better-cards-group" });

				const groupHeader = groupEl.createDiv({ cls: "better-cards-group-header" });
				const keyValue = group.key;
				groupHeader.setText(keyValue?.toString() || "No value");

				const groupGrid = groupEl.createDiv({
					cls: "better-cards-grid",
				});
				groupGrid.style.setProperty("--card-size", `${cardSize}px`);
				groupGrid.style.setProperty("--image-aspect-ratio", `${imageAspectRatio}`);

				for (const entry of group.entries) {
					this.renderCardForEntry(groupGrid, entry, {
						coverFallback,
						imagePropertyId,
						imageFit,
						displayPropertyIds,
						config: this.config,
					});
				}
			} else {
				// No groupBy - render directly in main grid
				for (const entry of group.entries) {
					this.renderCardForEntry(containerEl, entry, {
						coverFallback,
						imagePropertyId,
						imageFit,
						displayPropertyIds,
						config: this.config,
					});
				}
			}
		}
	}

	private renderCardForEntry(
		container: HTMLElement,
		entry: BasesEntry,
		options: {
			coverFallback: string;
			imagePropertyId: ReturnType<typeof this.config.getAsPropertyId>;
			imageFit: string;
			displayPropertyIds: ReturnType<typeof this.config.getOrder>;
			config: BasesViewConfig;
		}
	): void {
		const file = entry.file;
		if (!file) return;

		const cardEl = container.createDiv({ cls: "better-cards-card" });

		renderCard(this.app, cardEl, entry, {
			coverFallback: options.coverFallback,
			imagePropertyId: options.imagePropertyId,
			imageFit: options.imageFit,
			displayPropertyIds: options.displayPropertyIds,
			config: options.config,
		});

		// Handle click to open note
		cardEl.addEventListener("click", (e) => {
			const isNewTab = e.ctrlKey || e.metaKey;
			this.app.workspace.openLinkText(file.path, "", isNewTab);
		});
	}
}
