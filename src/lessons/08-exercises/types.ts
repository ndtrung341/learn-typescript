export interface MonsterCard {
	type: 'monster';
	name: string;
	archetype: string;
	atk: number;
	def: number;
}

export interface SpellTrapCard {
	type: 'spell' | 'trap';
	name: string;
	archetype: string;
	race: string;
}

export type Card = MonsterCard | SpellTrapCard;

export type ApiResponse<T> =
	| {
			status: 'success';
			data: T;
	  }
	| {
			status: 'error';
			error: string;
	  };
export type CallbackBasedAsyncFunction<T> = (callback: (response: ApiResponse<T>) => void) => void;
export type SourceObject<T> = { [K in keyof T]: CallbackBasedAsyncFunction<T[K]> };
export type PromisifiedObject<T> = { [K in keyof T]: () => Promise<T[K]> };
