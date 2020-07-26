import Rect from "./rect";
import Point from "../Geometry/Point";

export default class Room {
 
    entrances : Point[];
    points : Point[];

    static  directions : Point[] = [new Point(1,0), new Point(0,1), new Point(-1,0), new Point(0,-1)]

	constructor(rect : Rect) { 
        this.entrances = []
        this.points = []
        for (var i = 0; i <  rect.width;i++){
            for (var j = 0; j <  rect.height;j++){
                this.points.push(new Point(i +  rect.x, j +  rect.y))
            }
        }
    }

    merge (other : Room){
        this.points= this.points.concat(other.points)
        this.entrances= this.entrances.concat(other.entrances)
    }
    
    addEntrance (entrance : Point){
        var index  = this.points.findIndex((p) => {
            return entrance.Equals(p)
        })
        if (index === -1){
            return;
        }
        
        this.entrances.push(entrance);
    }

    area(){
        return this.points.length
    }

    getEdgePoints () {
        var edgePoints = this.points.filter((point) => {
            var neighbors = Point.Neighbors(this.points, point);
            return neighbors.length < 4
        })
        return edgePoints
    }

    getInnerPoints () {
        var edgePoints = this.points.filter((point) => {
            var neighbors = Point.Neighbors(this.points, point);
            return neighbors.length === 4
        })
        return edgePoints
    }

    static IsNeighbor ( room : Room, other : Room){
        var points1 = room.points;
        var points2 = other.points;
        var edges1 : Point[] = []
        var edges2: Point[] = []
        
        points1.forEach((p) => {
            Room.directions.forEach((dir) => {
                edges1.push(new Point(dir.x + p.x, dir.y + p.y))
            })
        })
        points2.forEach((p) => {
            Room.directions.forEach((dir) => {
                edges2.push(new Point(dir.x + p.x, dir.y + p.y))
            })
        })

        var intersection = edges1.filter((a) => {
            return edges2.find((b) => {
                return Point.Equals(a,b)
            })
        })
        return intersection.length > 0

        // if (  
        //    room.rect.x === other.rect.x + other.rect.width && room.rect.y === other.rect.y)
        //  {
        //     return true;
        // }
        
        // if (  
        //     room.rect.x === other.rect.x  && room.rect.y === other.rect.y + other.rect.height)
        //   {
        //      return true;
        //  }
        
         
        //  if (  
        //     room.rect.x + room.rect.width === other.rect.x && room.rect.y === other.rect.y)
        //   {
        //      return true;
        //  }
        
         
        //  if (  
        //     room.rect.x === other.rect.x && room.rect.y + room.rect.height === other.rect.y )
        //   {
        //      return true;
        //  }
        //  return false;
    }
 

    static IndexOf (room : Room, rooms : Room[]){
        return rooms.findIndex((r) => {
            return Room.Equals(r,room)
        })
    }

    static GetNeighbors (room : Room, rooms : Room[]){
        return rooms.filter((r2) => {
            return Room.IsNeighbor(room, r2)
        })
    }

	static compare(a : Rect, b : Rect) {
		return a.area() > b.area() ? 1 : a.area() === b.area() ? 0 : -1;
	}
 
	static Equals(a : Room, b : Room) {
        var points1 = a.points;
        var points2 = b.points;
		var intersection = a.points.filter((p) => {
            return b.points.find((p2) => {
                return Point.Equals(p2,p)
            })
        })
        return intersection.length === points1.length && intersection.length === points2.length
	}

	static Contains(array : Array<Room>, r  : Room) {
		return (
			array.find((r2) => {
				return Room.Equals(r,r2)
			}) 
		);
	}
}
