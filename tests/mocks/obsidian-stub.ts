// Stub for Obsidian API - re-exports mocks and types for testing

export class Component {
	loaded = false;
	load(): void {
		this.loaded = true;
	}
	unload(): void {
		this.loaded = false;
	}
}

export const MarkdownRenderer = {
	render: (app: any, markdown: string, el: HTMLElement) => {
		el.textContent = markdown;
		return Promise.resolve();
	},
};

// Export placeholder types (not used at runtime in tests)
export type App = any;
export type TFile = any;
export type BasesEntry = any;
export type BasesViewConfig = any;
export type BasesPropertyId = any;
