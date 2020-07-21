import { Colors } from '@blueprintjs/core';
import Room from "./Room"
import Point from '../Geometry/Point';

export default class Tile {
	x: number;
	y: number;
    color: string;
    borderTop: number

    borderBottom: number;
    borderLeft: number;
    borderRight: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
        this.color = Colors.WHITE;
        this.borderTop = 0;
        this.borderBottom= 0;
        this.borderLeft= 0;
        this.borderRight=0;
    }
    
    styleBorder(room : Room){
        var points = room.points;
        var neighbors = [   

            new Point(  this.x,  this.y + 1),
            new Point(  this.x,   this.y- 1),
            new Point( this.x - 1,   this.y),
            new Point( this.x + 1,   this.y),
        ]
        if (! Point.Contains(points, neighbors[0])){
            this.borderTop = 1
        }
        if (! Point.Contains(points, neighbors[1])){
            this.borderBottom = 1
        }
        if (! Point.Contains(points, neighbors[2])){
            this.borderLeft = 1
        }
        if (! Point.Contains(points, neighbors[3])){
            this.borderRight = 1
        }
    }

	style() {
		return {
			zIndex: 1,
			backgroundColor: this.color,
			color: 'black',
			width: `${25  }px`,
			height: `${25 }px`,
            borderTop : `${this.borderTop}px solid ${Colors.BLACK}`,
            
            borderBottom : `${this.borderBottom}px solid ${Colors.BLACK}`,
            
            borderLeft : `${this.borderLeft}px solid ${Colors.BLACK}`,
            
			borderRight : `${this.borderRight}px solid ${Colors.BLACK}`,
		 
		};
    }
     

	static compare(a: Tile, b: Tile) {
		return a.x - b.x + a.y - b.y;
	}

	toString() {
		return this.x + ':' + this.y;
	}

	static Equals(a: Tile, b: Tile) {
		return a.x === b.x && a.y === b.y;
	}

	Equals(a: Tile) {
		return this.x === a.x && this.y === a.y;
	}

	static Contains(array: Array<Tile>, point: Tile) {
		return (
			array.find((p) => {
				return Tile.Equals(p, point);
			}) !== undefined
		);
	}
}
