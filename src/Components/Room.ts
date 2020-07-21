import Rect from "./rect";
import Point from "../Geometry/Point";

export default class Room {

    rect : Rect; 
    entrances : Point[];
    points : Point[];

	constructor(rect : Rect) {
        this.rect = rect
        this.entrances = []
        this.points = []
        for (var i = 0; i < this.rect.width;i++){
            for (var j = 0; j < this.rect.height;j++){
                this.points.push(new Point(i + this.rect.x, j + this.rect.y))
            }
        }
    }


    
    addEntrance (entrance : Point){
        var index  = this.points.findIndex((p) => {
            return entrance.Equals(p)
        })
        if (index === -1){
            return;
        }
        
        this.entrances.push(entrance);
        this.points.splice(index,1)
    }

    area(){
        return this.rect.area
    }
 
    static GetNeighbors (room : Room, rooms : Room[]){
        var count = 0;
        var rect = room.rect;
        if ( rooms .find((r) => {
            return r.rect.x === rect.x + rect.width && r.rect.y === rect.y
        })) {
            count++;
        }
        
        if ( rooms.find((r) => {
            return r.rect.x === rect.x  && r.rect.y  === rect.y + rect.height
        })) {
            count++;
        }
    
    
        if ( rooms .find((r) => {
            return r.rect.x + r.rect.width === rect.x  && r.rect.y === rect.y
        })) {
            count++;
        }
        
        if ( rooms .find((r) => {
            return r.rect.y + r.rect.height === rect.y  && r.rect.x === rect.x 
        })) {
            count++;
        }
        return count;
    }

	static compare(a : Rect, b : Rect) {
		return a.area() > b.area() ? 1 : a.area() === b.area() ? 0 : -1;
	}
 

	static Equals(a : Room, b : Room) {
		return a.rect.Equals(b.rect);
	}

	static Contains(array : Array<Room>, r  : Room) {
		return (
			array.find((r2) => {
				return Rect.Equals(r,r2);
			}) 
		);
	}
}
