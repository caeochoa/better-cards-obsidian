import { vi } from 'vitest';

/**
 * Mock HTMLElement with Obsidian's helper methods
 */
class MockHTMLElement {
	element: HTMLElement;

	constructor(tagName: string = 'div') {
		this.element = document.createElement(tagName);
	}

	createEl<K extends keyof HTMLElementTagNameMap>(
		tag: K,
		options?: { cls?: string; attr?: Record<string, string> }
	): HTMLElementTagNameMap[K] {
		const el = document.createElement(tag);
		if (options?.cls) {
			el.className = options.cls;
		}
		if (options?.attr) {
			Object.entries(options.attr).forEach(([key, value]) => {
				el.setAttribute(key, value);
			});
		}
		this.element.appendChild(el);

		// Add Obsidian helper methods to child elements
		const childMock = new MockHTMLElement();
		childMock.element = el;
		(el as any).createEl = childMock.createEl.bind(childMock);
		(el as any).createDiv = childMock.createDiv.bind(childMock);
		(el as any).createSpan = childMock.createSpan.bind(childMock);
		(el as any).addClass = childMock.addClass.bind(childMock);
		(el as any).removeClass = childMock.removeClass.bind(childMock);
		(el as any).setText = childMock.setText.bind(childMock);

		return el;
	}

	createDiv(options?: { cls?: string }): HTMLDivElement {
		return this.createEl('div', options);
	}

	createSpan(options?: { cls?: string }): HTMLSpanElement {
		return this.createEl('span', options);
	}

	addClass(className: string): void {
		this.element.classList.add(className);
	}

	removeClass(className: string): void {
		this.element.classList.remove(className);
	}

	setText(text: string): void {
		this.element.textContent = text;
	}

	get style(): CSSStyleDeclaration {
		return this.element.style;
	}
}

/**
 * Create a mock HTMLElement with Obsidian's helper methods
 */
export function createMockElement(tagName: string = 'div'): HTMLElement {
	const mock = new MockHTMLElement(tagName);
	const element = mock.element;

	// Add Obsidian's helper methods to the real HTMLElement
	(element as any).createEl = mock.createEl.bind(mock);
	(element as any).createDiv = mock.createDiv.bind(mock);
	(element as any).createSpan = mock.createSpan.bind(mock);
	(element as any).addClass = mock.addClass.bind(mock);
	(element as any).removeClass = mock.removeClass.bind(mock);
	(element as any).setText = mock.setText.bind(mock);

	return element;
}

/**
 * Mock TFile
 */
export interface MockTFile {
	path: string;
	basename: string;
	name: string;
	extension: string;
}

export function createMockTFile(path: string): MockTFile {
	const parts = path.split('/');
	const name = parts[parts.length - 1];
	const nameParts = name.split('.');
	const extension = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
	const basename = nameParts.slice(0, -1).join('.') || name;

	return {
		path,
		basename,
		name,
		extension,
	};
}

/**
 * Mock App
 */
export interface MockApp {
	vault: {
		cachedRead: ReturnType<typeof vi.fn>;
		getResourcePath: ReturnType<typeof vi.fn>;
	};
	metadataCache: {
		getFirstLinkpathDest: ReturnType<typeof vi.fn>;
	};
}

export function createMockApp(): MockApp {
	return {
		vault: {
			cachedRead: vi.fn(),
			getResourcePath: vi.fn((file: MockTFile) => `app://local/${file.path}`),
		},
		metadataCache: {
			getFirstLinkpathDest: vi.fn(),
		},
	};
}

/**
 * Mock BasesEntry
 */
export interface MockBasesEntry {
	file: MockTFile | null;
	getValue: ReturnType<typeof vi.fn>;
}

export function createMockBasesEntry(file: MockTFile | null = null): MockBasesEntry {
	return {
		file,
		getValue: vi.fn(),
	};
}

/**
 * Mock BasesViewConfig
 */
export interface MockBasesViewConfig {
	get: ReturnType<typeof vi.fn>;
	getDisplayName: ReturnType<typeof vi.fn>;
	getAsPropertyId: ReturnType<typeof vi.fn>;
	getOrder: ReturnType<typeof vi.fn>;
}

export function createMockBasesViewConfig(): MockBasesViewConfig {
	return {
		get: vi.fn(),
		getDisplayName: vi.fn((id: string) => id),
		getAsPropertyId: vi.fn((key: string) => key),
		getOrder: vi.fn(() => []),
	};
}

/**
 * Mock Component
 */
export class MockComponent {
	loaded = false;

	load(): void {
		this.loaded = true;
	}

	unload(): void {
		this.loaded = false;
	}
}

/**
 * Mock MarkdownRenderer
 */
export const MockMarkdownRenderer = {
	render: vi.fn((app: any, markdown: string, el: HTMLElement) => {
		el.textContent = markdown;
		return Promise.resolve();
	}),
};
