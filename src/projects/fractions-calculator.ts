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

document.write(`	<div class="bg-white my-12 shadow-xl rounded-xl max-w-3xl mx-auto py-8">
			<h1 class="text-2xl text-center mb-8 font-mono font-bold">Fractions Calculator</h1>
			<div class="flex">
				<div class="px-8 w-1/2">
					<div class="flex justify-center space-x-6 mb-10 items-center">
						<div class="flex flex-col space-y-2">
							<input
								id="numeratorA"
								type="text"
								class="font-mono focus:outline-none w-10 h-16 border border-slate-600 rounded-md inline-block text-center text-2xl"
							/>
							<div class="bg-slate-400 h-0.5"></div>
							<input
								id="denominatorA"
								type="text"
								class="font-mono focus:outline-none w-10 h-16 border border-slate-600 rounded-md inline-block text-center text-2xl"
							/>
						</div>
						<select
							class="appearance-none font-mono text-2xl px-5 py-1 rounded-md border border-slate-600 focus:outline-none"
							id="operation"
						>
							<option value="" selected hidden></option>
							<option value="add">+</option>
							<option value="subtract">-</option>
							<option value="multiply">×</option>
							<option value="divide">÷</option>
						</select>
						<div class="flex flex-col space-y-2">
							<input
								id="numeratorB"
								type="text"
								class="font-mono focus:outline-none w-10 h-16 border border-slate-600 rounded-md inline-block text-center text-2xl"
							/>
							<div class="bg-slate-400 h-0.5"></div>
							<input
								id="denominatorB"
								type="text"
								class="font-mono focus:outline-none w-10 h-16 border border-slate-600 rounded-md inline-block text-center text-2xl"
							/>
						</div>
					</div>
					<div class="flex justify-center space-x-4">
						<button
							class="w-24 py-1.5 text-lg bg-sky-400 text-white rounded-md text-center cursor-pointer"
							id="btnSubmit"
						>
							Submit
						</button>
						<button
							class="w-24 py-1.5 text-lg bg-red-400 text-white rounded-md text-center cursor-pointer"
							id="btnClear"
						>
							Clear
						</button>
					</div>
				</div>
				<div class="px-8 w-1/2">
					<div class="font-mono italic text-lg underline">Result list:</div>
					<div class="result-list space-y-4 mt-6"></div>
				</div>
			</div>
		</div>`);

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

	let equation = `${fractionA} ${operation.symbol} ${fractionB} = ${fractionC}`;

	resultList.insertAdjacentHTML(
		'afterbegin',
		`<div class="border border-slate-400 rounde-md bg-white px-4 py-2">${equation}</div>`,
	);
});
