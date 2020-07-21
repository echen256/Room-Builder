export default class Point {

	x : number;
	y : number;

	constructor(x : number, y : number) {
		this.x = x;
		this.y = y;
	}

	static compare(a : Point, b : Point) {
		return a.x - b.x + a.y - b.y;
	}

	toString() {
		return this.x + ':' + this.y;
	}

	static Equals(a : Point, b : Point) {
		return a.x === b.x && a.y === b.y;
	}

	Equals(a : Point) {
		return this.x === a.x && this.y === a.y;
	}

	static Contains(array : Array<Point>, point : Point) {
		return (
			array.find((p) => {
				return Point.Equals(p, point);
			}) !== undefined
		);
	}
}
