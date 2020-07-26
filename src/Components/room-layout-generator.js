import Point from "../Geometry/Point";

export const generateLayout = (points, props, money,newGrid) => {
    const checkIfPointExists = (nextPoint, points) => {
		return points.find((p) => {
			return nextPoint.x === p.x && nextPoint.y === p.y;
		});
	};

	const arrayFill = (point, points, prop, direction, originalPoints) => {
		var maxCount = 3;
		var maxArea = 7;
		var positions = [];
		var propArea = prop.width * prop.height;
		var currentArea = 0;

		while (currentArea < maxArea && positions.length < maxCount) {
			if (checkIfPropFits(point, points, prop, originalPoints)) {
				positions.push(point);
				point = {
					x: point.x + direction.x * prop.width,
					y: point.y + direction.y * prop.height
				};
				currentArea += propArea;
			} else {
				return positions;
			}
		}
		return positions;
	};
	const multipleArrayFill = (point, points, prop, originalPoints) => {
		var directions = [ { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 } ];
		var positions = [];

		for (var i = 0; i < directions.length; i++) {
			var possiblePositions = arrayFill(point, points, prop, directions[i], originalPoints);
			if (possiblePositions.length >= positions.length) {
				positions = possiblePositions;
			}
		}
		return positions;
	};

	const checkWallHuggerCondition = (point, points, prop) => {
		for (var i = 0; i < prop.width; i++) {
			for (var j = 0; j < prop.height; j++) {
				var p2 = { x: point.x + i, y: point.y + j };
				if (Point.Neighbors( points, p2).length === 4){
					return false
				}
			 
			}
		}
		return true;
	};

	const checkIfPropFits = (point, points, prop, originalPoints) => {
		for (var i = 0; i < prop.width; i++) {
			for (var j = 0; j < prop.height; j++) {
				var p2 = { x: point.x + i, y: point.y + j };

				if (! Point.Contains(points,p2)){
					return false 
				}
			 
			}
		}
		var wallHuggerCondition = true;
		if (prop.wallHugger) {
			wallHuggerCondition = checkWallHuggerCondition(point, originalPoints, prop);
		}
		return true && wallHuggerCondition;
	};

	const drawProp = (prop, point, points) => {
		var removedPoints = [];
		for (var i = -1; i < prop.width + 1; i++) {
			for (var j = -1; j < prop.height + 1; j++) {
				var p2 = { x: point.x + i, y: point.y + j };
				var tile = newGrid.getTile(p2.x, p2.y);
				if (tile !== undefined) {
					if (i < prop.width && j < prop.height && j > -1 && i > -1) {
						newGrid.getTile(p2.x, p2.y).color = prop.color;
					}
					removedPoints.push(p2);
				}
			}
		}

		var newPoints = [];
		for (var i = 0; i < points.length; i++) {
			var p = points[i];
			if (
				!removedPoints.find((p2) => {
					return p.x === p2.x && p.y === p2.y;
				})
			) {
				newPoints.push(points[i]);
			}
		}
		points = newPoints;
		return points;
    };
    
    let loopPoints = [...points]
	let originalPoints = [ ...points ];

	while (loopPoints.length > 0) {
        loopPoints = loopPoints.sort((a,b) => {
            return Point.Neighbors( loopPoints,a).length > Point.Neighbors( loopPoints,b).length
        })
        var index = 0;
       // var index = Math.floor(Math.random() * loopPoints.length)
        var p = loopPoints[index]
        loopPoints.splice(index,1)
		var validProps = [];
		for (var j = 0; j < props.length; j++) {
			var prop = props[j];

			var arrayFillPositions = multipleArrayFill(p, points, prop, originalPoints);

			if (arrayFillPositions.length > 0) {
				validProps.push({ prop: prop, positions: arrayFillPositions });
			}
		}
		if (validProps.length !== 0) {
			var index = Math.floor(Math.random() * validProps.length);
			var { prop, positions } = validProps[index];

			money -= prop.cost;
			for (var i = 0; i < positions.length; i++) {
				points = drawProp(prop, positions[i], points);
			}
		}
	}
}