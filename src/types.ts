// string, number, boolean
let fullName = 'Nguyen Duy Trung';
let age: number = 22; // Type Annotations
let isMale: boolean = true;

// arrays
let friends: string[] = ['Minh Tan', 'Trung Son'];
let hobbies: Array<string> = ['Play game', 'Read comics'];
let favoriteNumbers: number[] = [1, 2.5];

// object
const person: {
	fullname: string;
	age: number;
	isMale: boolean;
	friends: string[];
	hobbies: string[];
} = {
	fullname: fullName,
	age: age,
	isMale: isMale,
	friends: friends,
	hobbies: hobbies,
};

const circle: { color: string; radius: number } = {
	color: 'black',
	radius: 12,
};

// nested object, tuple, enum, any
type Title = [string, string]; // tuple;
enum Gender {
	FEMALE,
	MALE,
	ANOTHER,
}

type Lecturer = {
	name: string;
	age: number;
	gender: Gender;
	birthday?: Date;
	title: Array<Title>; // list tuple;
	department?: {
		code: string;
		name: string;
	};
	[key: string]: unknown;
};

let lecturerA: Lecturer = {
	name: 'Nguyễn Duy Trung',
	age: 22,
	gender: Gender.MALE,
	birthday: new Date(2001, 11, 1),
	title: [['ThS', 'Thạc sĩ']],
	department: {
		code: 'CNTT',
		name: 'Công Nghệ Thông Tin',
	},
};

let lecturerB: Lecturer = {
	name: 'Cao Hùng Phi',
	age: 22,
	gender: Gender.MALE,
	title: [
		['PGS', 'Phó giáo sư'],
		['TS', 'Tiến sĩ'],
	],
};
lecturerA.salary = 14000;
lecturerB.salary = '25000';
lecturerB.note = 'Trùm trường';

// Union type
function date2String(date: string | Date = new Date()): string {
	if (typeof date === 'string') {
		if (isNaN(Date.parse(date))) throw Error('Invalid date');
		return new Date(date).toLocaleDateString('en-US');
	}
	return date.toLocaleDateString('en-US');
}

console.log(date2String());
console.log(date2String('2001/11/1'));

// Literal types - tập hợp cùng loại
type OddNumber = 1 | 3 | 5 | 7 | 9;
type EvenNumberString = 'zero' | 'two' | 'four' | 'six' | 'eight';
type OddEvenNumber = OddNumber | EvenNumberString; // union type -> tập hợp khác loại

// Function & callback
function printInfoLecturer(lecturer: Lecturer): void {
	console.log(`${lecturer.name}`);
}

let lecturerList: Lecturer[] = [lecturerA, lecturerB];
function findLecturerByName(
	name: string,
	lecturers: Lecturer[],
	callback: (result: Lecturer) => void,
) {
	let result = lecturers.find((i) => i.name === name);
	if (result) callback(result);
	else console.log('Not found lecturer');
}
findLecturerByName('Nguyễn Duy Trung', lecturerList, printInfoLecturer);

const calculatorSalary = (salary: number): number => {
	return salary * 2;
};
