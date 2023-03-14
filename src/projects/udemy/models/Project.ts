export enum ProjectStatus {
	ACTIVE,
	FINISH,
}

export interface IProject {
	id: number;
	title: string;
	description: string;
	members: number;
	status: ProjectStatus;
}

export type Listener<T> = (items: T[]) => void;

export class State<T> {
	protected listeners: Listener<T>[] = [];
	addListener(listener: Listener<T>) {
		this.listeners.push(listener);
	}
}
class ProjectManager extends State<IProject> {
	private static instance: ProjectManager;
	private projects: IProject[] = [];
	static get INSTANCE() {
		return this.instance ?? (this.instance = new ProjectManager());
	}
	private constructor() {
		super();
	}
	addProject(title: string, description: string, members: number) {
		const newProject: IProject = {
			id: Math.random(),
			title,
			description,
			members,
			status: ProjectStatus.ACTIVE,
		};
		this.projects.push(newProject);
		for (const fn of this.listeners) {
			fn(this.projects.slice());
		}
	}
	moveProject(projectID: string, newStatus: ProjectStatus) {
		const project = this.projects.find((p) => p.id.toString() === projectID);
		if (project) {
			project.status = newStatus;
			for (const listener of this.listeners) {
				listener(this.projects.slice());
			}
		}
	}
}
export const projectManager = ProjectManager.INSTANCE;
