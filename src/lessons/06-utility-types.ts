export {};
type Person = {
	name: string;
	age?: number;
	address: string;
};

// 1 - Partial<Type>
type CustomPartial<T> = {
	[P in keyof T]?: T[P];
};
type PersonPartial = CustomPartial<Person>;
// or use
// type PersonPartial = Partial<Person>;

// 2 - Required<Type>
type CustomRequired<T> = {
	[P in keyof T]-?: T[P];
};
type PersonRequired = CustomRequired<Person>;
// or use
// type PersonRequired = Required<Person>;

// 3 - Readonly<Type>
type CustomReadonly<T> = {
	readonly [P in keyof T]: T[P];
};
type PersonReadonly = CustomReadonly<Person>;
// or use
// type PersonReadonly = Readonly<Person>;

// 4 - Record<Keys, Type>
type CustomRecord<K extends string | number | symbol, T> = {
	[P in K]: T;
};
type PersonRecord = CustomRecord<'1' | '2', Person>;
// or use
// type PersonRecord = Record<'1' | '2', Person>;

// 5 - Exclude<UnionType, ExcludedMembers>
type CustomExclude<T, U> = T extends U ? never : T;
type NumberExclude = CustomExclude<2 | 5, 5>;

// 6 - Extract<Type, Union>
type CustomExtract<T, U> = T extends U ? T : never;
type NumberExtract = CustomExtract<2 | 5, 5>;

// 7 - Pick<Type, Keys>
type CustomPick<T, K extends keyof T> = {
	[P in K]: T[K];
};
type PersonPick = CustomPick<Person, 'name' | 'age'>;
// type PersonPick = Pick<Person, 'name' | 'age'>;

// 8 - Omit<Type, Keys>
type CustomOmit<T, K extends string | number | symbol> = Pick<T, Exclude<keyof T, K>>;
type PersonOmit = CustomOmit<Person, 'address'>;
// type PersonOmit = Omit<Person, 'address'>;

// 9 - NonNullable<Type>
type CustomNonNullable<T> = T extends null | undefined | never ? never : T;
type A = CustomNonNullable<number | null | string | undefined>;

// 10 - Parameters<Type>
type Func = (a: number, b: string) => string | number;
type CustomParameters<T extends (...args: any[]) => any> = T extends (...args: infer P) => any
	? P
	: never;

type ParamsType = CustomParameters<Func>;
type ParamTypeFirst = CustomParameters<Func>[0];

// 11 - ReturnType<Type>
type CustomReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R
	? R
	: any;
type T1 = CustomReturnType<Func>;
