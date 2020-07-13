import React, { useState } from 'react';
import { Card, Colors, Button, InputGroup, Divider, H1, Popover, H3, NonIdealState } from '@blueprintjs/core';
import Grid from './../Components/graph';
import GridRenderer from './../Components/graph_renderer';
import axios from 'axios';
import './../layouts/index';
import Rect from '../Components/rect';
import {generateLayout} from "../Components/room-layout-generator"
import {basicClusterGenerator} from "../Components/cluster-generator"

axios.defaults.headers.common = {
	'Content-Type': 'application/json'
};

function Generator() {
	const width = 30;
	const height = 30;
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
			height: 1,
			cost: 5,
			color: Colors.COBALT1,
			wallHugger: true
		}
	];

	let rects = basicClusterGenerator();
	let points = [];
	rects.forEach((rect) => {
		for (var i = 0; i < rect.width; i++) {
			for (var j = 0; j < rect.height; j++) {
				points.push({ x: i + rect.x, y: j + rect.y });
				newGrid.getTile(i + rect.x, j + rect.y).color = Colors.GRAY1;
			}
		}
	});

    generateLayout(points, props, money,newGrid)
    

	return (
		<div style={{ margin: 'auto', marginTop: '100px', width: 'fit-content' }}>
			<div>
				<GridRenderer grid={newGrid} />
				<br />
			</div>
		</div>
	);
}



export default Generator;
