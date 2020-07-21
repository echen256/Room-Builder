import Point from './Point';
import Edge from './Edge';

export default class Prims {



	results = Array<Edge>()
	newPoints = Array<Point>()
	points = Array<Point>()
	edges = Array<Edge>()

	

	init(edges : Array<Edge>) {
		this.results = Array<Edge>();
		this.newPoints = Array<Point>();
		this.points = Array<Point>();
		this.edges = edges;

		edges.forEach((element) => {
			this.points.push(element.p1);
			this.points.push(element.p2);
		});
		this.points = Array.from(new Set<Point>(this.points));

		var point = this.points[0];
		this.newPoints.push(point);
	}

	iterate() {
		if (this.newPoints.length >= this.points.length) {
			return new Array<Edge>();
		}
		var edge = this.select(this.newPoints, this.edges);
		if (edge === undefined) {
			console.log(this.safety);
			return  new Array<Edge>();
		}
		this.results.push(edge);
		this.newPoints.push(edge.p1);
		this.newPoints.push(edge.p2);
		this.newPoints = Array.from(new Set<Point>(this.newPoints));
		this.safety--;
		if (this.safety < 0) {
			console.log('ERROR');
			return  new Array<Edge>();;
		}
		return this.results;
	}

	calculate(edges : Array<Edge>) {
		this.init(edges);
		while (this.newPoints.length < this.points.length) {
			var edge = this.select(this.newPoints, edges);
			if (edge === undefined) {
				console.log(this.safety);
				break;

				
			}
			this.results.push(edge);
			this.newPoints.push(edge.p1);
			this.newPoints.push(edge.p2);
			this.newPoints = Array.from(new Set<Point>(this.newPoints));
			this.safety--;
			if (this.safety < 0) {
				console.log('ERROR');
				break;
			}
		}
		return this.results;
	}

	removePoint(point : Point, points : Array<Point>) {
		let pointIndex = points.findIndex((item) => {
			return Point.Equals(item, point);
		});
		return points.splice(pointIndex, 1);
	}

	safety = 200;

	select(newPoints : Array<Point>, edges : Array<Edge>)  {
		let filteredEdges = Array<Edge>();
    
        edges.forEach((edge) => {
            let b1 = newPoints.filter((point) => {
                return Point.Equals(point, edge.p1)
            }).length > 0 ? 1 : 0

            let b2 = newPoints.filter((point) => {
                return Point.Equals(point, edge.p2)
            }).length > 0 ?  1 : 0

            if (b1 + b2 === 1) {
				filteredEdges.push(edge);
			}

		});


		if (filteredEdges.length === 0) return undefined;
		filteredEdges = filteredEdges.sort((a, b) => {
			if (a.weight > b.weight) return 1;
			if (a.weight < b.weight) return -1;
			return 0;
		});

		let result = filteredEdges[0];
		let index = edges.findIndex((item) => {
			return Edge.Equals(item, result);
		});
		edges = edges.splice(index, 1);

		return result;
	}
}
