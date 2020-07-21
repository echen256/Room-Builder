
export default class Point {

	x : number;
	y : number;
	static  directions : Point[] = [new Point(1,0), new Point(0,1), new Point(-1,0), new Point(0,-1)]

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

	static Neighbors(array : Array<Point>, point : Point) {
		var neighbors : Point[]= [];
		Point.directions.forEach((dir) => {
			var p2 = new Point(dir.x + point.x, dir.y + point.y);
			if (Point.Contains(array,p2)){
				neighbors.push(p2);
			}
		})
		return neighbors;
	}
}
