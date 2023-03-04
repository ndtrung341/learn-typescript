"use strict";
function mergeObjects(objA, objB) {
    return Object.assign(Object.assign({}, objA), objB);
}
const general = {
    name: 'Trung',
    age: 22,
    hobbies: ['Game', 'Book'],
};
const address = {
    district: 'Cai Be',
    province: 'Tien Giang',
};
let myInfo = mergeObjects(general, { address });
console.log(myInfo);
function objectHasKeyWithValue(obj, key, value) {
    if (key in obj)
        return compareObjects(obj[key], value);
    return false;
}
function compareObjects(objA, objB) {
    if (typeof objA !== typeof objB) {
        return false;
    }
    if (typeof objA === 'string' || typeof objA === 'number' || typeof objA === 'boolean') {
        return objA === objB;
    }
    for (const [key, valueA] of Object.entries(objA || {})) {
        if (!(key in objB)) {
            return false;
        }
        const valueB = objB[key];
        return compareObjects(valueA, valueB);
    }
    return true;
}
let test1 = objectHasKeyWithValue(myInfo, 'hobbies', ['Game', 'Book']);
console.log(test1); // true
let test2 = objectHasKeyWithValue(myInfo, 'address', {
    district: 'Cai Lay',
    province: 'Tien Giang',
});
console.log(test2); // false
