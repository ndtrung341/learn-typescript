import { autoBind } from '../decorators/AutoBind';
import { Draggable } from '../models/DragDrop';
import { IProject } from '../models/Project';
import { Component } from './BaseComponent';

export class ProjectItem extends Component<HTMLElement, HTMLElement> implements Draggable {
	constructor(rootID: string, public project: IProject) {
		console.log(rootID);
		super('#single-project', '#' + rootID, 'beforeend');
		this.configurable();
		this.renderContent();
	}
	@autoBind
	dragStartHandler(event: DragEvent) {
		event.dataTransfer!.setData('text/plain', this.project.id.toString());
		event.dataTransfer!.effectAllowed = 'move';
	}
	@autoBind
	dragEndHandler(_: DragEvent) {}
	configurable(): void {
		this.element.addEventListener('dragstart', this.dragStartHandler);
		this.element.addEventListener('dragend', this.dragEndHandler);
	}
	renderContent(): void {
		this.element.id = this.project.id.toString();
		this.element.querySelector('h2')!.innerText = this.project.title;
		this.element.querySelector('h3')!.innerText = this.project.members.toString();
		this.element.querySelector('p')!.innerText = this.project.description;
	}
}
