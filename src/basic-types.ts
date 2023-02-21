declare const math: any;
declare const MathJax: any;

type OperationName = 'add' | 'subtract' | 'multiply' | 'divide';
interface Operation {
	symbol: string;
	name: OperationName;
}
const addition: Operation = {
	symbol: '+',
	name: 'add',
};

const subtraction: Operation = {
	symbol: '-',
	name: 'subtract',
};

const multiplication: Operation = {
	symbol: '*',
	name: 'multiply',
};

const division: Operation = {
	symbol: ':',
	name: 'divide',
};

class Fraction {
	numerator: number;
	denominator: number = 1;

	constructor(numerator: number, denominator: number = 1) {
		if (denominator === 0) throw Error('Denominator can not be zero');
		this.numerator = numerator * Math.sign(denominator);
		this.denominator = denominator * Math.sign(denominator);
	}

	calculate(other: Fraction, operator: Operation, logger: boolean = false): Fraction {
		let result: Fraction;

		switch (operator.name) {
			case 'add':
			case 'subtract': {
				let commonDenominator = findLCM(this.denominator, other.denominator);
				result = new Fraction(
					this.numerator * (commonDenominator / this.denominator) +
						other.numerator *
							(commonDenominator / other.denominator) *
							(operator.name === 'add' ? 1 : -1),
					commonDenominator,
				);
				break;
			}
			case 'multiply': {
				result = new Fraction(
					this.numerator * other.numerator,
					this.denominator * other.denominator,
				);
				break;
			}
			case 'divide': {
				result = new Fraction(
					this.numerator * other.denominator,
					this.denominator * other.numerator,
				);
				break;
			}
			default:
				throw new Error('Invalid operator');
		}

		if (logger) {
			console.log(`${this} ${operator.symbol} ${other} = ${result.simplify()}`);
		}

		return result;
	}

	simplify() {
		let gcd = findGCD(Math.abs(this.numerator), this.denominator);
		this.numerator /= gcd;
		this.denominator /= gcd;
		return this;
	}

	toString() {
		this.simplify();
		if (this.denominator === 1) return this.numerator;
		else if (this.numerator === 0) return 0;
		return `${this.numerator}/${this.denominator}`;
	}
}

function findGCD(a: number, b: number): number {
	if (a === 0) {
		return b;
	}
	return findGCD(b % a, a);
}

function findLCM(a: number, b: number): number {
	let min = a < b ? a : b;
	while (min % a !== 0 || min % b !== 0) {
		min++;
	}
	return min;
}

const numeratorA = document.querySelector('#numeratorA') as HTMLInputElement;
const denominatorA = document.querySelector('#denominatorA') as HTMLInputElement;
const numeratorB = document.querySelector('#numeratorB') as HTMLInputElement;
const denominatorB = document.querySelector('#denominatorB') as HTMLInputElement;
const operationSelect = document.querySelector('#operation') as HTMLSelectElement;
const btnSubmit = document.querySelector('#btnSubmit') as HTMLButtonElement;
const btnClear = document.querySelector('#btnClear') as HTMLButtonElement;
const resultList = document.querySelector('.result-list') as HTMLElement;

btnClear.addEventListener('click', function () {
	numeratorA.value = numeratorB.value = denominatorA.value = denominatorB.value = '';
	operationSelect.value = '';
});

btnSubmit.addEventListener('click', function () {
	let fractionA = new Fraction(+numeratorA.value, +denominatorA.value);
	let fractionB = new Fraction(+numeratorB.value, +denominatorB.value);
	let operation: Operation;
	switch (operationSelect.value as OperationName) {
		case 'add':
			operation = addition;
			break;
		case 'subtract':
			operation = subtraction;
			break;
		case 'multiply':
			operation = multiplication;
			break;
		case 'divide':
			operation = division;
			break;
		default:
			throw Error('Invalid operator');
	}
	let fractionC = fractionA.calculate(fractionB, operation, true);

	let equationLatex: string = math
		.parse(`(${fractionA}) ${operation.symbol} (${fractionB}) == ${fractionC}`)
		.toTex({ parenthesis: 'auto' });

	if (operation.name === 'multiply') {
		equationLatex = equationLatex.replace('\\cdot', '\\times');
	} else if (operation.name === 'divide') {
		equationLatex = equationLatex.replace(':', '\\div');
	}

	resultList.insertAdjacentHTML(
		'afterbegin',
		`<div class="border border-slate-400 rounde-md bg-white px-4">$$${equationLatex}$$</div>`,
	);
	MathJax.typeset();
});
