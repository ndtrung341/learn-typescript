export {};
interface Rectangle {
	readonly type: 'rectangle';
	width: number;
	length: number;
}

interface Circle {
	readonly type: 'circle';
	radius: number;
}

type Shape = Circle | Rectangle;

function isCircle(shape: Shape): shape is Circle {
	return 'radius' in shape;
}

function isRectangle(shape: Shape): shape is Rectangle {
	return shape.type === 'rectangle';
}

const calcAreaShape: (shape: Shape) => number = (shape) => {
	let result = 0;
	if (isCircle(shape)) {
		result = shape.radius ** 2 * Math.PI;
	} else if (isRectangle(shape)) result = shape.length * shape.width;
	return result;
};

let shapes: Shape[] = [
	{
		type: 'circle',
		radius: 2,
	},
	{
		type: 'rectangle',
		length: 2,
		width: 3,
	},
];

shapes.map(calcAreaShape);
