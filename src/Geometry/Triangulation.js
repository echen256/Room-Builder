import Point from './Point';
import Edge from './Edge';
import Delaunator from 'delaunator';

export class Triangulation {
	results = [];
	newPoints = [];
	edges = [];

	compute(points) {
		let coordinates = [];

		points.forEach((point) => {
			coordinates.push(point.x);
			coordinates.push(point.y);
		});
		let dela = new Delaunator(coordinates);
		let triangles = dela.triangles;
		let edges = [];
		for (let i = 0; i < triangles.length; i += 3) {
			let v0 = points[triangles[i]];
			let v1 = points[triangles[i + 1]];
			let v2 = points[triangles[i + 2]];

			let newEdges = [ new Edge(v0, v1), new Edge(v1, v2), new Edge(v2, v0) ];
			newEdges.forEach((e) => {
				if (!Edge.Contains(edges, e)) {
					edges.push(e);
				}
			});
		}

		return edges;
	}
}
