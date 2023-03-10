import {
	ApiResponse,
	CallbackBasedAsyncFunction,
	Card,
	MonsterCard,
	PromisifiedObject,
	SourceObject,
	SpellTrapCard,
} from './types';

let monsterCards: MonsterCard[] = [
	{
		type: 'monster',
		name: 'Blue-Eyes White Dragon',
		archetype: 'Blue-Eyes',
		atk: 3000,
		def: 2500,
	},
	{
		type: 'monster',
		name: 'Maiden with Eyes of Blue',
		archetype: 'Blue-Eyes',
		atk: 0,
		def: 0,
	},
	{
		type: 'monster',
		name: 'Dragon Spirit of White',
		archetype: 'Blue-Eyes',
		atk: 2500,
		def: 2000,
	},
	{
		type: 'monster',
		name: 'Dark Magician',
		archetype: 'Dark Magician',
		atk: 2500,
		def: 2100,
	},
	{
		type: 'monster',
		name: 'Dark Magician Girl',
		archetype: 'Dark Magician',
		atk: 2000,
		def: 1700,
	},
];

let spellTrapCards: SpellTrapCard[] = [
	{
		type: 'spell',
		name: 'Beacon of White',
		archetype: 'Blue-Eyes',
		race: 'Equip',
	},
	{
		type: 'spell',
		name: 'Neutron Blast',
		archetype: 'Blue-Eyes',
		race: 'Normal',
	},
	{
		type: 'trap',
		name: 'The Ultimate Creature of Destruction',
		archetype: 'Blue-Eyes',
		race: 'Normal',
	},
	{
		type: 'spell',
		name: 'Magic Formula',
		race: 'Equip',
		archetype: 'Dark Magician',
	},
	{
		type: 'trap',
		name: 'Chaos Scepter Blast',
		race: 'Quick-Play',
		archetype: 'Dark Magician',
	},
];

function isSpellTrapCard(card: Card): card is SpellTrapCard {
	return (card as SpellTrapCard).race !== undefined;
}

function isMonsterCard(card: Card): card is MonsterCard {
	return card.type === 'monster';
}

function logCardInfo(card: Card) {
	let info: {} = { '🃏': card.name };
	if (isMonsterCard(card)) {
		info = { ...info, '🔪': card.atk, '🩸': card.def, archetype: card.archetype };
	} else if (isSpellTrapCard(card)) {
		info = { ...info, race: card.race, archetype: card.archetype };
	}
	console.log(JSON.stringify(info) + '\n');
}

let cards: Card[] = [...monsterCards, ...spellTrapCards];

export function filterMonsterCards(
	cards: Card[],
	criteria: Partial<Omit<MonsterCard, 'type'>>,
): MonsterCard[] {
	let criteriaKeys = Object.keys(criteria) as (keyof Omit<MonsterCard, 'type'>)[];
	return cards
		.filter(isMonsterCard)
		.filter((monsterCard) => criteriaKeys.every((key) => monsterCard[key] === criteria[key]));
}
// console.group('Filter Card');
// filterMonsterCards(cards, { archetype: 'Blue-Eyes' }).forEach(logCardInfo);
// console.groupEnd();

const getObjectKeys = <T extends object>(obj: T) => {
	return Object.keys(obj) as (keyof T)[];
};

function filterCards(
	cards: Card[],
	type: 'monster',
	criteria: Partial<Omit<MonsterCard, 'type'>>,
): MonsterCard[];
function filterCards(
	cards: Card[],
	type: 'spell-trap',
	criteria: Partial<Omit<SpellTrapCard, 'type'>>,
): SpellTrapCard[];
function filterCards(cards: Card[], type: string, criteria: Partial<Omit<Card, 'type'>>) {
	let criteriaKeys = getObjectKeys(criteria);
	return cards
		.filter((card) =>
			type === 'spell-trap' ? ['spell', 'trap'].includes(card.type) : card.type === type,
		)
		.filter((monsterCard) => criteriaKeys.every((key) => monsterCard[key] === criteria[key]));
}

console.group('Filter Monster');
filterCards(cards, 'monster', { archetype: 'Blue-Eyes' }).forEach(logCardInfo);
console.groupEnd();
console.group('Filter Spell Trap');
filterCards(cards, 'spell-trap', { archetype: 'Dark Magician' }).forEach(logCardInfo);
console.groupEnd();

function swapCards<T1, T2>(card1: T1, card2: T2): [T2, T1] {
	return [card2, card1];
}
export const [secondCard, firstCard] = swapCards(spellTrapCards[0], monsterCards[1]);

function promisify<T>(fn: CallbackBasedAsyncFunction<T>): () => Promise<T> {
	return () =>
		new Promise((resolve, reject) => {
			// cho chay ham fn va truyen callback vao thoi
			fn((response) => {
				if (response.status === 'success') resolve(response.data);
				else reject(new Error(response.error));
			});
		});
}

const oldApis = {
	requestMonsterCards(callback: (response: ApiResponse<MonsterCard[]>) => void) {
		callback({
			status: 'success',
			data: monsterCards,
		});
	},
	requestSpellTrapCards(callback: (response: ApiResponse<SpellTrapCard[]>) => void) {
		callback({
			status: 'success',
			data: spellTrapCards,
		});
	},
	requestCurrentServerTime(callback: (response: ApiResponse<number>) => void) {
		callback({
			status: 'success',
			data: Date.now(),
		});
	},
	requestQueueLength(callback: (response: ApiResponse<number>) => void) {
		callback({
			status: 'error',
			error: 'Numeric value has exceeded Number.MAX_SAFE_INTEGER.',
		});
	},
};

function promisifyAll<T extends { [k: string]: any }>(obj: SourceObject<T>): PromisifiedObject<T> {
	let result: Partial<PromisifiedObject<T>> = {};
	for (const [key, value] of Object.entries(obj)) {
		result[key as keyof T] = promisify(value);
	}
	return result as PromisifiedObject<T>;
}

export let apis2 = {
	requestMonsterCards: promisify(oldApis.requestMonsterCards),
	requestSpellTrapCards: promisify(oldApis.requestSpellTrapCards),
	requestCurrentServerTime: promisify(oldApis.requestCurrentServerTime),
	requestQueueLength: promisify(oldApis.requestQueueLength),
};

let apis = promisifyAll(oldApis);

async function startTheApp(callback: (error: Error | null) => void) {
	try {
		console.log('Monsters:');
		(await apis.requestMonsterCards()).forEach(logCardInfo);
		console.log();

		console.log('Users:');
		(await apis.requestSpellTrapCards()).forEach(logCardInfo);
		console.log();

		console.log('Server time:');
		console.log(`   ${new Date(await apis.requestCurrentServerTime()).toLocaleString()}`);
		console.log();

		console.log('Coffee machine queue length:');
		console.log(`   ${await apis.requestQueueLength()}`);
	} catch (error) {
		callback(error as Error);
	}
}

startTheApp((e: Error | null) => {
	console.log();
	if (e) {
		console.log(`Error: "${e.message}", but it's fine, sometimes errors are inevitable.`);
	} else {
		console.log('Success!');
	}
});

type ObjectWithNewProp<T, K extends string, V> = T & {
	[NK in K]: V;
};

export class ObjectManipulator<T> {
	constructor(protected obj: T) {}

	public set<K extends string, V>(key: K, value: V) {
		return new ObjectManipulator({ ...this.obj, [key]: value } as ObjectWithNewProp<T, K, V>);
	}

	public get<K extends keyof T>(key: K) {
		return this.obj[key];
	}

	public delete<K extends keyof T>(key: K): ObjectManipulator<Omit<T, K>> {
		const newObj = { ...this.obj };
		delete newObj[key];
		return new ObjectManipulator(newObj);
	}

	public getObject() {
		return this.obj;
	}
}
