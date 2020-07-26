import { Colors } from '@blueprintjs/core';
import axios from 'axios';
import React from 'react';
import shuffle from '../Algos/Shuffle';
import { standardDivision } from '../Components/cluster-generator';
import Room from '../Components/Room';
import { generateLayout } from '../Components/room-layout-generator';
import Point from '../Geometry/Point';
import Grid from './../Components/graph';
import GridRenderer from './../Components/graph_renderer';
import './../layouts/index';


axios.defaults.headers.common = {
	'Content-Type': 'application/json'
};

function Generator() {
	const width = 150;
	const height = 150;
	let newGrid = new Grid({ width, height, rotation: 0 });
	let money = 1000;
	let props = [
		{
			width: 3,
			height: 2,
			cost: 30,
			color: Colors.RED1,
			wallHugger: false
		},
		{
			width: 3,
			height: 2,
			cost: 30,
			color: Colors.RED5,
			wallHugger: false
		},
		{
			width: 3,
			height: 2,
			cost: 30,
			color: Colors.ORANGE3,
			wallHugger: false
		},
		{
			width: 3,
			height: 3,
			cost: 50,
			color: Colors.GREEN1,
			wallHugger: false
		},
		{
			width: 4,
			height: 4,
			cost: 50,
			color: Colors.GREEN3,
			wallHugger: false
		},
		{
			width: 5,
			height: 5,
			cost: 50,
			color: Colors.GREEN5,
			wallHugger: false
		},
		{
			width: 1,
			height: 1,
			cost: 5,
			color: Colors.BLUE5,
			wallHugger: true
		},
		{
			width: 1,
			height: 2,
			cost: 5,
			color: Colors.COBALT1,
			wallHugger: true
		}
	];

	let output = standardDivision();
	let rects = output.nonPaths;
	let rooms = [] 
	rects.forEach((rect) => { 
		let r = new Room(rect)
		rooms.push(r)
	});

	chooseEntrances(rooms, output, newGrid)
	rooms = mergeRoomsWithNoEntrances(rooms )
	drawPaths(output, newGrid)
	drawRooms(rooms, output, newGrid, props, money)
	 

	return (
		<div style={{ margin: 'auto', marginTop: '100px', width: 'fit-content' }}>
			<div>
				<GridRenderer grid={newGrid} />
				<br />
			</div>
		</div>
	);
}

const mergeRoomsWithNoEntrances = (rooms) => {
	let numberOfRoomsWithNoEntrances = rooms.filter((r) => {
		return r.entrances.length === 0
	})
	while (numberOfRoomsWithNoEntrances.length > 0){
		rooms = mergeRooms(rooms)
		numberOfRoomsWithNoEntrances = rooms.filter((r) => {
			return r.entrances.length === 0
		})
	}
	return rooms
}

const mergeRooms = (rooms ) => {
	rooms = rooms.sort((a,b) => {
		return a.entrances - b.entrances
	})
	let newRooms = []
	rooms = [...rooms]
	while (rooms.length > 0){
		let r = rooms.pop();

		let neighbors = Room.GetNeighbors(r, rooms)
		
		let area = 1000;
		let selectedRoom = undefined;
		neighbors.forEach((neighbor) => {
			if ( neighbor.area() < area){
				selectedRoom = neighbor
				area = neighbor.area()
			}
		})
 
		if (selectedRoom !== undefined){
			let index =  Room.IndexOf(selectedRoom, rooms)
			r.merge (selectedRoom)
			rooms.splice(index,1)
			
		}
		newRooms.push(r)
		
	}
	return newRooms
}

const drawPaths = (output, newGrid) => {
	let pathRects = output.paths;

	pathRects.forEach((rect) => {
		for (let i = 0; i < rect.width; i++) {
			for (let j = 0; j < rect.height; j++) {
				
				newGrid.getTile(i + rect.x, j + rect.y).color = Colors.BLACK;
			}
		}
	});

	output.centers.forEach((rect) => {
		for (let i = 0; i < rect.width; i++) {
			for (let j = 0; j < rect.height; j++) {
				newGrid.getTile(i + rect.x, j + rect.y).color = Colors.WHITE;
			}
		}
	});
}

const drawRooms =  (rooms, output, newGrid, props, money) => {
	rooms.forEach((r) => {  
		let innerPoints = r.getInnerPoints();
		r.getEdgePoints().forEach((p ) => {
			let tile = newGrid.getTile(p.x,   p.y)
			tile.styleBorder(r)
			tile.color = Colors.GRAY1;
		})

		innerPoints.forEach((p ) => {
			let tile = newGrid.getTile(p.x,   p.y)
			tile.styleBorder(r)
			tile.color = Colors.LIGHT_GRAY1;
		})

		

		let entrances = r.entrances;
		entrances .forEach((p ) => {
			newGrid.getTile(p.x,   p.y).color = Colors.INDIGO1;
		})


		innerPoints = innerPoints.filter((p) => {
			return Point.Neighbors(entrances,p).length === 0
		})

		generateLayout(innerPoints, props, money, newGrid);
	})

}

const chooseEntrances = (rooms, output, newGrid) => {
	rooms.forEach((r) => {
 
		let neighboringPaths = output.paths.filter((other) => {
			return Room.IsNeighbor(new Room(other),r )
		}) 
		let neighboringPoints = []
		neighboringPaths.forEach((rect) => {
			neighboringPoints = neighboringPoints.concat(new Room(rect).points)
		}) 
		let borderPoints = r.points.filter((p) => {
			let count = 0;
			for (let i = -1; i < 2;i++){
				for (let j = -1; j < 2;j++){
					let sum = Math.abs(i) + Math.abs(j)
					if (sum === 1){
						let p2 = new Point(i + p.x, j + p.y)
						if (neighboringPoints.find((p3) => {
							return Point.Equals(p2,p3)
						})){
							count++;
						}
					}
				}
			}
			return count > 0
		})

		borderPoints = borderPoints.filter((p) => {
			let neighbors = Point.Neighbors(r.points,p)
			return neighbors.length === 3
		})
	
		// borderPoints.forEach((p) => {
		// 	newGrid.getTile( p.x, p.y).color = Colors.GRAY5;
		// })

		borderPoints = shuffle(borderPoints)
		for (let i = 0; i < Math.min(1, borderPoints.length); i++){
			r.addEntrance(borderPoints[i])
		}
	})
}

export default Generator;
