import { autoBind } from '../decorators/AutoBind';
import { DragTarget } from '../models/DragDrop';
import { IProject, projectManager, ProjectStatus } from '../models/Project';
import { Component } from './BaseComponent';
import { ProjectItem } from './ProjectItem';

export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
	projects: IProject[] = [];
	listElement: HTMLUListElement;
	constructor(private type: keyof typeof ProjectStatus) {
		super('#project-list', '#app', 'beforeend');
		this.element.id = `${this.type.toLocaleLowerCase()}-projects`;
		this.configurable();
		this.renderContent();
	}
	@autoBind
	dragOverHandler(event: DragEvent) {
		if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
			event.preventDefault();
			this.listElement.classList.add('droppable');
		}
	}
	@autoBind
	dropHandler(event: DragEvent) {
		const projectId = event.dataTransfer!.getData('text/plain');
		console.log(projectId);
		projectManager.moveProject(
			projectId,
			this.type === 'ACTIVE' ? ProjectStatus.ACTIVE : ProjectStatus.FINISH,
		);
	}
	@autoBind
	dragLeaveHandler(_: DragEvent) {
		this.listElement.classList.remove('droppable');
	}
	configurable(): void {
		this.listElement = this.element.querySelector('ul')!;
		this.listElement.id = `${this.type.toLowerCase()}-projects-list`;
		this.element.addEventListener('dragover', this.dragOverHandler);
		this.element.addEventListener('dragleave', this.dragLeaveHandler);
		this.element.addEventListener('drop', this.dropHandler);
		projectManager.addListener((projects) => {
			this.projects = projects.filter(({ status }) => status === ProjectStatus[this.type]);
			this.renderProjects();
		});
	}
	renderProjects() {
		this.listElement.innerHTML = '';
		for (const project of this.projects) {
			new ProjectItem(this.listElement.id, project);
		}
	}
	renderContent() {
		this.element.querySelector('h2')!.textContent = this.type + ' PROJECTS';
		this.renderProjects();
	}
}
