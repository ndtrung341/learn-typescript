import 'ndtrung-test-lib';

declare module 'ndtrung-test-lib' {
	interface MylibDetails {
		multiply: ReturnType<CalculateTwoNumber>;
		divide: ReturnType<CalculateTwoNumber>;
	}
	const add: CalculateTwoNumber;
	const subtract: CalculateTwoNumber;
}
