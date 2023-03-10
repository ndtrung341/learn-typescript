export {};
type Subject = 'math' | 'literature' | 'english';

// CLASS DECORATOR
function InitClass(name: string, birthday: Date) {
	return function <T extends { new (...args: any[]): {} }>(target: T) {
		target.prototype.display = function () {
			let s = `${this.name} - ${this.birthday.toLocaleDateString()}`;
			console.log(s);
			return s;
		};

		return class extends target {
			marks = {
				math: 9,
				literature: 8,
				english: 8,
			};
			constructor(...args: any[]) {
				super(name, birthday);
			}
		};
	};
}

// METHOD DECORATOR
function displayAcademicLevel(target: any, propertyName: string, descriptor: PropertyDescriptor) {
	let originalMethod = descriptor.value;
	descriptor.value = function (...args: any[]) {
		let average = originalMethod.apply(this, args);
		let level: string;
		if (average >= 8) level = 'Giỏi';
		else if (average >= 6 && average < 8) level = 'Khá';
		else if (average >= 4 && average < 6) level = 'Trung bình';
		else level = 'Yếu';
		console.log(`Điểm:${average} - Học lực:${level}`);
		return average;
	};
	return descriptor;
}

// ACCESSOR DECORATOR
function displayMarks(style: 'inline' | 'table') {
	return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.get;
		descriptor.get = function () {
			let result = originalMethod?.call(this);
			switch (style) {
				case 'inline':
					console.log(
						Object.entries(result)
							.map(([key, value]) => {
								return `${key}:${value}`;
							}, '')
							.join(' - '),
					);
					break;
				case 'table':
					console.table(result);
			}
			return result;
		};
	};
}

type IValidateParams = {
	[methodName: string]: {
		[paramIndex: number]: {
			name: string;
			msg?: string;
			options?: (string | number)[];
		}[];
	};
};

let validateParams: IValidateParams = {};

// PARAMETER DECORATOR
function positive(msg?: string) {
	return function (target: any, propertyName: string, parameterIndex: number) {
		let rule = {
			name: 'positive',
			msg: msg,
		};

		validateParams[propertyName] ??= {};
		validateParams[propertyName][parameterIndex] ??= [];
		validateParams[propertyName][parameterIndex].push(rule);
	};
}

function max(max: number, msg?: string) {
	return function (target: any, propertyName: string, parameterIndex: number) {
		let rule = {
			name: 'max',
			msg: msg,
			options: [max],
		};

		validateParams[propertyName] ??= {};
		validateParams[propertyName][parameterIndex] ??= [];
		validateParams[propertyName][parameterIndex].push(rule);
	};
}

function validate(target: any, propertyName: string, descriptor: PropertyDescriptor) {
	let originalMethod = descriptor.value;
	descriptor.value = function (...args: any[]) {
		for (let [index, rules] of Object.entries(validateParams[propertyName])) {
			for (let rule of rules) {
				switch (rule.name) {
					case 'positive':
						if (args[+index] < 0) throw new Error(rule.msg || 'Trường này phải la so duong');
						break;
					case 'max':
						if (args[+index] > rule.options![0])
							throw new Error(
								rule.msg || 'Trường này không duoc lớn hơn ' + rule.options![0],
							);
						break;
				}
			}
		}
		let result = originalMethod.apply(this, args);
		return result;
	};
}

@InitClass('Nguyen Duy Trung', new Date(2007, 11, 1))
class Student {
	name?: string;
	birthday?: Date;
	marks: {
		[subject in Subject]: number;
	};

	constructor(name?: string, birthday?: Date) {
		this.name = name;
		this.birthday = birthday;
	}

	@displayMarks('table')
	get getMarks() {
		return this.marks;
	}

	@displayAcademicLevel
	getAverage() {
		let result = 0;
		for (let mark of Object.values(this.marks)) {
			result += mark;
		}
		return Math.floor(result / Object.keys(this.marks).length);
	}

	@validate
	addOrEditMark(
		subject: Subject,
		@max(10, 'Diem khong duoc vuot qua 10')
		@positive('Diem phai lon hon 0')
		mark: number,
	) {
		this.marks[subject] = mark;
	}

	@validate
	test(
		@max(5)
		a: number,
		@positive()
		b: number,
	) {}
}

let student = new Student();
// (student as any).display();
// student.getAverage();
student.addOrEditMark('math', 5);
student.getMarks;

student.test(4, -5);
export default 1;

// let x = {
// 	1: 3,
// };
// console.log(x[1]);
