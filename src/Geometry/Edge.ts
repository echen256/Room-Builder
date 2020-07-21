import Point from './Point';

export default class Edge {


	x1 : number;
	x2 : number;
	y1 : number;
	y2 : number;
	p1: Point;
	p2: Point;
	weight: number;
	distance: number;


	constructor(p1 : Point,p2 : Point) {
		this.x1 = p1.x;

		this.y1 = p1.y;

		this.x2 = p2.x;

		this.y2 = p2.y;

		this.p1 = p1;
		this.p2 = p2;
		this.weight = Edge.distance(p1,p2);
		this.distance = Edge.distance(p1,p2);
	}

	static distance = function(p1 : Point, p2 : Point) {
		let d = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y- p1.y, 2));
		return d;
	};

	length() {
		return Edge.distance(this.p1, this.p2);
	}

	static Contains (collection : Array<Edge>, edge : Edge) {
		return collection.filter((item) => {
			return Edge.Equals(edge,item)
		}).length > 0
	}

	static Equals (e1 : Edge, e2 : Edge){
		return (Point.Equals(e1.p1, e2.p1) && Point.Equals(e1.p2, e2.p2)) || 
		(Point.Equals(e1.p1, e2.p2) && Point.Equals(e1.p2, e2.p1))
	}

	static compare(a : Edge, b : Edge) {
		return a.weight - b.weight;
	}

	// static ShortestDistance = function (edge, point) {
	// 	var p2 = edge.p2;
	// 	var p1 = edge.p1;

	// 	return Math.abs(
	// 		(p2.y - p1.y) * point.x - (p2.x - p1.x) * point.y + p2.x * p1.y  - p2.y * p1.x
	// 	)/ Math.sqrt(Math.pow(p2.y - p1.y,2) + Math.pow(p2.x - p1.x, 2))
	// }

	static ShortestDistance = function (edge : Edge, point : Point) {

		let x = point.x;
		let y = point.y;
		let x1 = edge.x1;
		let x2 = edge.x2;
		let y1 = edge.y1;
		let y2 = edge.y2;
		var A = x - x1;
		var B = y - y1;
		var C = x2 - x1;
		var D = y2 - y1;

		var dot = A * C + B * D;
		var len_sq = C * C + D * D;
		var param = -1;
		if (len_sq !== 0) //in case of 0 length line
			param = dot / len_sq;
	  
		var xx, yy;
	  
		if (param < 0) {
		  xx = x1;
		  yy = y1;
		}
		else if (param > 1) {
		  xx = x2;
		  yy = y2;
		}
		else {
		  xx = x1 + param * C;
		  yy = y1 + param * D;
		}
	  
		var dx = x - xx;
		var dy = y - yy;
		return Math.sqrt(dx * dx + dy * dy);
	  }

	other(a : Point	) {
		if (a.Equals(this.p1)) return this.p2;
		else return this.p1;
	}


	getPoints() {
		let x0 = this.p1.x;
		let y0 =  this.p1.y;
		let x1 =  this.p2.x;
		let y1 =  this.p2.y;
		var dx = Math.abs(x1 - x0);
		var dy = Math.abs(y1 - y0);
		var sx = (x0 < x1) ? 1 : -1;
		var sy = (y0 < y1) ? 1 : -1;
		var err = dx - dy;
		let output = [];
		while(true) {
		   output.push(new Point(x0,y0)); 
	 
		   if ((x0 === x1) && (y0 === y1)) break;
		   var e2 = 2*err;
		   if (e2 > -dy) { err -= dy; x0  += sx; }
		   if (e2 < dx) { err += dx; y0  += sy; }
		}
		return output
	 }
}
