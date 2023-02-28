"use strict";
function isCircle(shape) {
    return 'radius' in shape;
}
function isRectangle(shape) {
    return shape.type === 'rectangle';
}
const calcAreaShape = (shape) => {
    if (isCircle(shape)) {
        return shape.radius ** 2 * Math.PI;
    }
    return shape.length * shape.width;
};
