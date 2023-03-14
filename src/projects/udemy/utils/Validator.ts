export type FormControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export interface RequiredRule {
	type: 'required';
	msg?: string;
}

export interface MinRule {
	type: 'min';
	min: number;
	msg?: string;
}

export interface MaxRule {
	type: 'max';
	max: number;
	msg?: string;
}

export interface PatternRule {
	type: 'pattern';
	pattern: RegExp;
	msg?: string;
}

export interface CustomRule {
	type: 'custom';
	fn: (value: string) => boolean;
	msg?: string;
}

export type ValidationRule = RequiredRule | MaxRule | MinRule | PatternRule | CustomRule;

export type ValidationSchema = Record<string, ValidationRule[]>;

export type ValidationError = {
	type: ValidationRule['type'];
	error: string;
};

export type ValidationErrors = Record<keyof ValidationSchema, ValidationError>;
export type ValidationFn<T> = (control: FormControl, rule: Extract<ValidationRule, T>) => boolean;

export default class FormValidator {
	public formElement: HTMLFormElement;
	public controls: FormControl[] = [];
	private errors: ValidationErrors = {};

	constructor(formId: string, private config: ValidationSchema) {
		this.formElement = document.getElementById(formId)! as HTMLFormElement;
		for (const name of Object.keys(config)) {
			const control = this.formElement.querySelector<FormControl>(`[name=${name}`)!;
			if (control) this.controls.push(control);
		}
	}

	public validate(): boolean {
		for (const [key, rules] of Object.entries(this.config)) {
			let control = this.controls.find((c) => c.name === key)!;

			for (const rule of rules) {
				const { type } = rule;
				if (
					(type === 'required' && !this.required(control, rule)) ||
					(type === 'min' && !this.min(control, rule)) ||
					(type === 'max' && !this.max(control, rule)) ||
					(type === 'pattern' && !this.pattern(control, rule)) ||
					(type === 'custom' && !this.custom(control, rule))
				) {
					break;
				}
			}
		}
		return Object.keys(this.errors).length === 0;
	}

	required: ValidationFn<RequiredRule> = (control, { msg, type }) => {
		let isValid = true;

		if (control.type === 'checkbox' || control.type === 'radio') {
			const list = document.querySelectorAll(`[name=${control.name}][checked]`);
			isValid = list.length !== 0;
		} else {
			isValid = !!control.value.trim();
		}
		if (!isValid)
			this.errors[control.name] = {
				type,
				error: msg || `This field ${name} is required.`,
			};

		return isValid;
	};

	min: ValidationFn<MinRule> = ({ value, name }, { min, msg, type }) => {
		if (+value < min) {
			this.errors[name] = {
				type,
				error: msg || `This field ${name} must be greater than or equal to ${min}.`,
			};
			return false;
		}
		return true;
	};

	max: ValidationFn<MaxRule> = ({ value, name }, { max, msg, type }) => {
		if (+value > max) {
			this.errors[name] = {
				type,
				error: msg || `This field ${name} must be less than or equal to ${max}.`,
			};
			return false;
		}
		return true;
	};

	pattern: ValidationFn<PatternRule> = ({ name, value }, { type, pattern, msg }) => {
		if (pattern.test(value)) {
			this.errors[name] = {
				type: type,
				error: msg || `This field ${name} does not match pattern.`,
			};
			return false;
		}
		return true;
	};

	custom: ValidationFn<CustomRule> = (control, { type, fn, msg }) => {
		let value: any;
		if (control.type === 'checkbox' || control.type === 'radio') {
			const checkedList = [
				...document.querySelectorAll<HTMLInputElement>(`[name=${control.name}][checked]`),
			].map((i) => i.value);
			value = control.type === 'radio' ? checkedList[0] : checkedList;
		} else value = control.value;

		if (!fn(value)) {
			this.errors[control.name] = {
				type: type,
				error: msg || `This field ${name} is invalid.`,
			};
			return false;
		}
		return true;
	};

	get getErrors() {
		return this.errors;
	}
}
