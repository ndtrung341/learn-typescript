export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
	template: HTMLTemplateElement;
	root: T;
	element: U;

	constructor(templateID: string, rootID: string, public insertPosition: InsertPosition) {
		this.template = document.querySelector<HTMLTemplateElement>(templateID)!;
		this.root = document.querySelector<T>(rootID)!;
		const templateContent = this.template.content.cloneNode(true) as HTMLElement;
		this.element = templateContent.firstElementChild as U;
		this.root.insertAdjacentElement(this.insertPosition, this.element);
	}

	abstract configurable(): void;
	abstract renderContent(): void;
}
