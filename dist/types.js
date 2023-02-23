"use strict";
// string, number, boolean
let fullName = 'Nguyen Duy Trung';
let age = 22; // Type Annotations
let isMale = true;
// arrays
let friends = ['Minh Tan', 'Trung Son'];
let hobbies = ['Play game', 'Read comics'];
let favoriteNumbers = [1, 2.5];
// object
const person = {
    fullname: fullName,
    age: age,
    isMale: isMale,
    friends: friends,
    hobbies: hobbies,
};
const circle = {
    color: 'black',
    radius: 12,
};
var Gender;
(function (Gender) {
    Gender[Gender["FEMALE"] = 0] = "FEMALE";
    Gender[Gender["MALE"] = 1] = "MALE";
    Gender[Gender["ANOTHER"] = 2] = "ANOTHER";
})(Gender || (Gender = {}));
let lecturerA = {
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
let lecturerB = {
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
function date2String(date = new Date()) {
    if (typeof date === 'string') {
        if (isNaN(Date.parse(date)))
            throw Error('Invalid date');
        return new Date(date).toLocaleDateString('en-US');
    }
    return date.toLocaleDateString('en-US');
}
console.log(date2String());
console.log(date2String('2001/11/1'));
// Function & callback
function printInfoLecturer(lecturer) {
    console.log(`${lecturer.name}`);
}
let lecturerList = [lecturerA, lecturerB];
function findLecturerByName(name, lecturers, callback) {
    let result = lecturers.find((i) => i.name === name);
    if (result)
        callback(result);
    else
        console.log('Not found lecturer');
}
findLecturerByName('Nguyễn Duy Trung', lecturerList, printInfoLecturer);
const calculatorSalary = (salary) => {
    return salary * 2;
};
