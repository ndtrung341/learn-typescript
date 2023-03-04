"use strict";
// SINGLETON
class DhSPKTVL {
    constructor(name = 'Dai Hoc SPKT VL', address = 'Vinh Long') {
        this.name = name;
        this.address = address;
    }
    static get Instance() {
        if (this.instance)
            return this.instance;
        return (this.instance = new DhSPKTVL());
    }
}
class Person {
    constructor(_name, _birthdate) {
        this._name = _name;
        this._birthdate = _birthdate;
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
    get birthdate() {
        return this._birthdate;
    }
    set birthdate(value) {
        this._birthdate = value;
    }
}
Person.school = DhSPKTVL.Instance.name;
class Teacher extends Person {
    constructor(name, birthdate, job) {
        super(name, birthdate);
        this.job = job;
    }
    toString() {
        return `Tui tên ${this.name}, sinh ngày ${this.birthdate.toLocaleDateString()}. Tui là một ${this.job} tại trường ${Person.school}`;
    }
}
class Student extends Person {
    constructor(name, birthdate, department) {
        super(name, birthdate);
        this.department = department;
    }
    toString() {
        return `Tui tên ${this.name}, sinh ngày ${this.birthdate.toLocaleDateString()}. Tui là một sinh viên đang theo học chuyên ngành ${this.department} tại trường ${Person.school}`;
    }
}
let teacher = new Teacher('Nguyen Duy Trung', new Date('2011/11/1'), 'Giảng Viên');
console.log(teacher);
let student = new Student('Nguyen Duy Trung', new Date('2011/11/1'), 'Kỹ Thuật Phần Mềm');
console.log(student);
class MyStorage {
    constructor() { }
    static setItem(key, value) {
        this.data[key] = value;
    }
    static getItem(key) {
        if (key in this.data)
            return this.data[key];
        return null;
    }
    static removeItem(key) {
        delete this.data[key];
    }
    static keys() {
        return Object.keys(this.data);
    }
    static clear() {
        this.data = {};
    }
}
MyStorage.data = {};
MyStorage.setItem('name', 'Duy Trung');
MyStorage.setItem('name', 'Trung');
MyStorage.removeItem('name');
let myName = MyStorage.getItem('name');
console.log(myName);
