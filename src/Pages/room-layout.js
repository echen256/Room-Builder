import React, { useState } from 'react';
import { Card, Colors, Button, InputGroup, Divider, H1, Popover, H3, NonIdealState } from '@blueprintjs/core';
import Grid from './../Components/graph';
import GridRenderer from './../Components/graph_renderer';
import axios from 'axios';
import './../layouts/index';
import Rect from '../Components/rect';

import Room from '../Components/Room';
import { generateLayout } from '../Components/room-layout-generator';
import { basicClusterGenerator, standardDivision } from '../Components/cluster-generator';
import Point from '../Geometry/Point';
import Tile from "../Components/Tile"
import shuffle from '../Algos/Shuffle';

axios.defaults.headers.common = {
	'Content-Type': 'application/json'
};

function Generator() {
	const width = 100;
	const height = 100;
	var newGrid = new Grid({ width, height, rotation: 0 });
	var money = 1000;

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
	let pathRects = output.paths;

	pathRects.forEach((rect) => {
		for (var i = 0; i < rect.width; i++) {
			for (var j = 0; j < rect.height; j++) {
				newGrid.getTile(i + rect.x, j + rect.y).color = Colors.BLACK;
			}
		}
	});

	output.centers.forEach((rect) => {
		for (var i = 0; i < rect.width; i++) {
			for (var j = 0; j < rect.height; j++) {
				newGrid.getTile(i + rect.x, j + rect.y).color = Colors.WHITE;
			}
		}
	});

	let rooms = []
	let points = [];
	rects.forEach((rect) => { 
		var r = new Room(rect)
		rooms.push(r)
	});

	chooseEntrances(rooms, output, newGrid)
	rooms = mergeRoomsWithNoEntrances(rooms )
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
	var numberOfRoomsWithNoEntrances = rooms.filter((r) => {
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
	var newRooms = []
	rooms = [...rooms]
	while (rooms.length > 0){
		var r = rooms.pop();
		var neighbors = rooms.filter((r2) => {
			return Room.IsNeighbor(r,r2)
		})

		for (var i = 0 ; i < neighbors.length;i++){
			if (Math.random() < .8){
				var index = rooms.findIndex((r3) => {
					return Room.Equals(r3,neighbors[i])
				})
				rooms.splice(index,1)
				let l1 = r.points.length
				r.merge (neighbors[i])
				let l2 = r.points.length
				console.log(l2 > l1)
			}
			

		}
		newRooms.push(r)
	}
	return newRooms
}

const drawRooms =  (rooms, output, newGrid, props, money) => {
	rooms.forEach((r) => { 
		var points = r.points;
		points.forEach((p ) => {
			var tile = newGrid.getTile(p.x,   p.y)
			tile.styleBorder(r)
			tile.color = Colors.GRAY1;
		})
		var entrances = r.entrances;
		entrances .forEach((p ) => {
			newGrid.getTile(p.x,   p.y).color = Colors.INDIGO1;
		})

		generateLayout(r.points, props, money, newGrid);
	})

}

const chooseEntrances = (rooms, output, newGrid) => {
	rooms.forEach((r) => {
 
		var neighboringPaths = output.paths.filter((other) => {
			return Room.IsNeighbor(new Room(other),r )
		}) 
		var neighboringPoints = []
		neighboringPaths.forEach((rect) => {
			neighboringPoints = neighboringPoints.concat(new Room(rect).points)
		}) 
		var borderPoints = r.points.filter((p) => {
			var count = 0;
			for (var i = -1; i < 2;i++){
				for (var j = -1; j < 2;j++){
					var sum = Math.abs(i) + Math.abs(j)
					if (sum === 1){
						var p2 = new Point(i + p.x, j + p.y)
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
	
		// borderPoints.forEach((p) => {
		// 	newGrid.getTile( p.x, p.y).color = Colors.GRAY5;
		// })

		borderPoints = shuffle(borderPoints)
		for (var i = 0; i < Math.min(1, borderPoints.length); i++){
			r.addEntrance(borderPoints[i])
		}
	})
}

// const chooseEntrances = (rooms, percentage) => {
//     var numberOfEntrances = Math.max(1, Math.round(rooms.length * percentage))
//     var pieces = [...rooms]
//     var roomsContainingEntrances = []
//     var count = 0;
//     while (count < numberOfEntrances){
//         if (pieces.length === 0) break;
//         var room = pieces.pop();
   
//         if (neighborCount(room, rooms) < 4){
//             roomsContainingEntrances.push(room)
//             count++;
//         }
        
//     }
//     return roomsContainingEntrances
// }


export default Generator;
