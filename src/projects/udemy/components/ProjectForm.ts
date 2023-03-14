import { autoBind } from '../decorators/AutoBind';
import { DragTarget } from '../models/DragDrop';
import { IProject, projectManager, ProjectStatus } from '../models/Project';
import FormValidator, { ValidationSchema } from '../utils/Validator';
import { Component } from './BaseComponent';
import { ProjectItem } from './ProjectItem';

export class ProjectForm extends Component<HTMLDivElement, HTMLFormElement> {
	titleInputElement: HTMLInputElement;
	descriptionInputElement: HTMLTextAreaElement;
	membersInputElement: HTMLInputElement;
	constructor() {
		super('#project-input', '#app', 'afterbegin');
		this.configurable();
	}
	configurable(): void {
		this.element.id = 'user-input';
		this.titleInputElement = this.element.querySelector<HTMLInputElement>('#title')!;
		this.descriptionInputElement =
			this.element.querySelector<HTMLTextAreaElement>('#description')!;
		this.membersInputElement = this.element.querySelector<HTMLInputElement>('#people')!;
		this.element.addEventListener('submit', this.submitHandler);
	}
	renderContent(): void {
		throw new Error('Method not implemented.');
	}
	@autoBind
	submitHandler(event: Event) {
		event.preventDefault();
		const [title, description, people] = this.getUserInputs();
		const schema: ValidationSchema = {
			title: [{ type: 'required' }],
			description: [
				{ type: 'required' },
				{
					type: 'custom',
					fn(value) {
						return value.length >= 10;
					},
				},
			],
			people: [{ type: 'required' }, { type: 'min', min: 1 }, { type: 'max', max: 3 }],
		};
		const validator = new FormValidator('user-input', schema);
		if (!validator.validate()) {
			console.log(validator.getErrors);
			alert('Invalid input');
		} else {
			projectManager.addProject(title, description, +people);
		}
	}
	getUserInputs(): [string, string, string] {
		const title = this.titleInputElement.value.trim();
		const description = this.descriptionInputElement.value.trim();
		const people = this.membersInputElement.value;
		return [title, description, people];
	}
}
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
