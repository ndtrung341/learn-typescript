var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
// CLASS DECORATOR
function InitClass(name, birthday) {
    return function (target) {
        target.prototype.display = function () {
            let s = `${this.name} - ${this.birthday.toLocaleDateString()}`;
            console.log(s);
            return s;
        };
        return class extends target {
            constructor(...args) {
                super(name, birthday);
                this.marks = {
                    math: 9,
                    literature: 8,
                    english: 8,
                };
            }
        };
    };
}
// METHOD DECORATOR
function displayAcademicLevel(target, propertyName, descriptor) {
    let originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        let average = originalMethod.apply(this, args);
        let level;
        if (average >= 8)
            level = 'Giỏi';
        else if (average >= 6 && average < 8)
            level = 'Khá';
        else if (average >= 4 && average < 6)
            level = 'Trung bình';
        else
            level = 'Yếu';
        console.log(`Điểm:${average} - Học lực:${level}`);
        return average;
    };
    return descriptor;
}
// ACCESSOR DECORATOR
function displayMarks(style) {
    return function (target, propertyName, descriptor) {
        const originalMethod = descriptor.get;
        descriptor.get = function () {
            let result = originalMethod === null || originalMethod === void 0 ? void 0 : originalMethod.call(this);
            switch (style) {
                case 'inline':
                    console.log(Object.entries(result)
                        .map(([key, value]) => {
                        return `${key}:${value}`;
                    }, '')
                        .join(' - '));
                    break;
                case 'table':
                    console.table(result);
            }
            return result;
        };
    };
}
let validateParams = {};
// PARAMETER DECORATOR
function positive(msg) {
    return function (target, propertyName, parameterIndex) {
        var _a, _b;
        var _c;
        let rule = {
            name: 'positive',
            msg: msg,
        };
        (_a = validateParams[propertyName]) !== null && _a !== void 0 ? _a : (validateParams[propertyName] = {});
        let rules = ((_b = (_c = validateParams[propertyName])[parameterIndex]) !== null && _b !== void 0 ? _b : (_c[parameterIndex] = []));
        validateParams[propertyName][parameterIndex].push(rule);
    };
}
function max(max, msg) {
    return function (target, propertyName, parameterIndex) {
        var _a, _b;
        var _c;
        let rule = {
            name: 'max',
            msg: msg,
            options: [max],
        };
        (_a = validateParams[propertyName]) !== null && _a !== void 0 ? _a : (validateParams[propertyName] = {});
        let rules = ((_b = (_c = validateParams[propertyName])[parameterIndex]) !== null && _b !== void 0 ? _b : (_c[parameterIndex] = []));
        validateParams[propertyName][parameterIndex].push(rule);
    };
}
function validate(target, propertyName, descriptor) {
    let originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        for (let [index, rules] of Object.entries(validateParams[propertyName])) {
            for (let rule of rules) {
                switch (rule.name) {
                    case 'positive':
                        if (args[+index] < 0)
                            throw new Error(rule.msg || 'Trường này phải la so duong');
                        break;
                    case 'max':
                        if (args[+index] > rule.options[0])
                            throw new Error(rule.msg || 'Trường này không duoc lớn hơn ' + rule.options[0]);
                        break;
                }
            }
        }
        let result = originalMethod.apply(this, args);
        return result;
    };
}
let Student = class Student {
    constructor(name, birthday) {
        this.name = name;
        this.birthday = birthday;
    }
    get getMarks() {
        return this.marks;
    }
    getAverage() {
        let result = 0;
        for (let mark of Object.values(this.marks)) {
            result += mark;
        }
        return Math.floor(result / Object.keys(this.marks).length);
    }
    addOrEditMark(subject, mark) {
        this.marks[subject] = mark;
    }
    test(a, b) { }
};
__decorate([
    displayMarks('table')
], Student.prototype, "getMarks", null);
__decorate([
    displayAcademicLevel
], Student.prototype, "getAverage", null);
__decorate([
    validate,
    __param(1, max(10, 'Diem khong duoc vuot qua 10')),
    __param(1, positive('Diem phai lon hon 0'))
], Student.prototype, "addOrEditMark", null);
__decorate([
    validate,
    __param(0, max(5)),
    __param(1, positive())
], Student.prototype, "test", null);
Student = __decorate([
    InitClass('Nguyen Duy Trung', new Date(2007, 11, 1))
], Student);
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
