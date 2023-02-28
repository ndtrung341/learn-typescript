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
	if (isCircle(shape)) {
		return shape.radius ** 2 * Math.PI;
	}
	return shape.length * shape.width;
};
