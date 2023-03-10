export {};
function mergeObjects<T extends object, U extends object>(objA: T, objB: U) {
	return { ...objA, ...objB };
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

function objectHasKeyWithValue<T extends object>(obj: T, key: any, value: any): boolean {
	if (key in obj) return compareObjects(obj[key as keyof T], value);
	return false;
}

function compareObjects<T, U>(objA: T, objB: U): boolean {
	if (typeof objA !== typeof objB) {
		return false;
	}

	if (typeof objA === 'string' || typeof objA === 'number' || typeof objA === 'boolean') {
		return objA === objB;
	}

	for (const [key, valueA] of Object.entries(objA || {})) {
		if (!(key in (objB as {}))) {
			return false;
		}

		const valueB = objB[key as keyof U] as object;
		return compareObjects(valueA as object, valueB);
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
