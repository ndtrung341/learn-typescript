// SINGLETON
class DhSPKTVL {
	private static instance: DhSPKTVL;
	private constructor(public name = 'Dai Hoc SPKT VL', public address = 'Vinh Long') {}

	static get Instance() {
		if (this.instance) return this.instance;
		return (this.instance = new DhSPKTVL());
	}
}

abstract class Person {
	static school = DhSPKTVL.Instance.name;
	constructor(private _name: string, private _birthdate: Date) {}
	get name() {
		return this._name;
	}

	set name(value: string) {
		this._name = value;
	}

	get birthdate() {
		return this._birthdate;
	}

	set birthdate(value: Date) {
		this._birthdate = value;
	}

	abstract toString(): string;
}

class Teacher extends Person {
	constructor(name: string, birthdate: Date, public job: string) {
		super(name, birthdate);
	}

	toString(): string {
		return `Tui tên ${
			this.name
		}, sinh ngày ${this.birthdate.toLocaleDateString()}. Tui là một ${this.job} tại trường ${
			Person.school
		}`;
	}
}

class Student extends Person {
	constructor(name: string, birthdate: Date, public department: string) {
		super(name, birthdate);
	}

	toString(): string {
		return `Tui tên ${
			this.name
		}, sinh ngày ${this.birthdate.toLocaleDateString()}. Tui là một sinh viên đang theo học chuyên ngành ${
			this.department
		} tại trường ${Person.school}`;
	}
}

let teacher = new Teacher('Nguyen Duy Trung', new Date('2011/11/1'), 'Giảng Viên');

console.log(teacher);

let student = new Student('Nguyen Duy Trung', new Date('2011/11/1'), 'Kỹ Thuật Phần Mềm');

console.log(student);
