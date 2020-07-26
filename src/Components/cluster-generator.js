
import { Card, Colors, Button, InputGroup, Divider, H1, Popover, H3, NonIdealState } from "@blueprintjs/core"
import Rect from '../Components/rect';
import Room from "../Components/Room"
import Point from "../Geometry/Point";
import {Triangulation} from "../Geometry/Triangulation"
import Prims from "../Geometry/Prims";
import shuffle from "../Algos/Shuffle" 

export const fill = (x, y, probability, rects) => {
    if (rects.find((r) => {
        return r.x === x && r.y === y
    })) return;
    rects.push(new Rect(1, 1, x, y));
    for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
            if (Math.abs(i) + Math.abs(j) === 1) {
                if (Math.random() < probability) {

                    fill(x + i, j + y, 3 * probability / 5, rects)
                }
            }
        }
    }
}

const chooseEntrances = (rects, percentage) => {
    var numberOfEntrances = Math.max(1, Math.round(rects.length * percentage))
    var pieces = [...rects]
    var rectsContainingEntrances = []
    var count = 0;
    while (count < numberOfEntrances){
        if (pieces.length === 0) break;
        var room = pieces.pop();
   
        if (neighborCount(room, rects) < 4){
            rectsContainingEntrances.push(room)
            count++;
        }
        
    }
    return rectsContainingEntrances
}



const processSingleRect = (r, rects, adjustedWidth, adjustedHeight) => {
    var upperRightCorner = [r.x + r.width, r.y + r.height]


    for (var j = 0; j < rects.length; j++) {

        var r2 = rects[j];

        if (!(r2.width === r.width && r2.height === r.height && r2.x === r.x && r2.y === r.y)) {
            if (r.x === r2.x) {

                r2.width = adjustedWidth

            }


            if (r.y === r2.y) {


                r2.height = adjustedHeight

            }

            if (r2.x >= upperRightCorner[0]) {
                r2.x += adjustedWidth - r.width
            }
            if (r2.y >= upperRightCorner[1]) {
                r2.y += adjustedHeight - r.height
            }



        }


    }

    r.width = adjustedWidth
    r.height = adjustedHeight
}

const insertTemplate = (rects)=> {
    
    let centers = []
    let paths = [];
    let nonPaths = [];
    let allRects = [];
    for (var i = 0; i < rects.length; i++) {
        var r = rects[i];


        for (var j = 0; j < 3;j++){
            for (var k = 0; k < 3;k++){
                let r2 = new Rect(1,1,r.x * 3 + j, r.y * 3 + k);
                if (j === 1 & k === 1){
                    centers.push(r2)
                } else 
                if (j === 1 || k === 1 ){
                    paths.push(r2);
                } else {
                    nonPaths.push(r2);
                }
                allRects.push(r2)
            }
        }
    }

    return {
        paths ,
        nonPaths,
        centers,
        allRects,
        originalCluster : rects
    }
}

const buildHallways = (output) => {
    var possibleEntrancePoints = output.allRects.filter((path) => {
        return neighborCount(path, output.allRects) === 3 && 
        output.paths.find((p) => {return p.x === path.x && p.y === path.y})
    })
    possibleEntrancePoints = shuffle(possibleEntrancePoints)

    var entranceCount = Math.max(1, Math.round( .35 * output.originalCluster.length));
    var selectedPaths = []
    var entrances = []
    var i = 0;
    while (i < entranceCount && possibleEntrancePoints.length > 0){
        i++;
        var entrance = possibleEntrancePoints.pop();
        selectedPaths.push(new Rect(1,1,entrance.x, entrance.y)) 
    }
    output.entrances = entrances

    let triangulationPoints = []
    output.centers.forEach((center) => {
        triangulationPoints.push(new Point(center.x,center.y))
    })
    var edges = new Triangulation().compute(triangulationPoints)
    edges = new Prims().calculate(edges)
    
    edges.forEach((edge) => {
        var points = edge.getPoints();
        points.forEach((point ) => {
            selectedPaths.push(point)
        })
    })

    var paths = [...output.paths]
    var newPaths = []
    while (paths.length > 0){
        var path = paths.pop(); 
        if (! selectedPaths.find((point) => {
            return point.x === path.x && point.y === path.y
        })) {
            output.nonPaths.push(path)
        } else {
            
            newPaths.push(path)
        }
    }
    output.paths = newPaths;
}

export const standardDivision = (newGrid) => {
    var rects = []
    fill( 5,  5, .95 ,rects);
    let output = insertTemplate(rects);
    buildHallways(output)
     
    for (var i = 0; i < output.nonPaths.length; i++) {
        var r = output.nonPaths[i];
        var adjustedHeight =  4 + Math.floor(Math.random() *4);
        var adjustedWidth =  4 +Math.floor(Math.random() * 4);
        processSingleRect(r, output.allRects, adjustedWidth, adjustedHeight)
    }

    for (var i = 0; i < output.centers.length; i++) {
        var r = output.centers[i];
        var adjustedHeight =Math.round(Math.random()   )  + 3
        var adjustedWidth = Math.round(Math.random() )  + 3
        processSingleRect(r, output.allRects, adjustedWidth,adjustedHeight)
    }

    return output;
}

export const basicClusterGenerator = () => {
    var rects = []
    fill( 5,  5, .95, rects);
    for (var i = 0; i < rects.length; i++) {
        var r = rects[i];
        var adjustedHeight =  2 + Math.floor(Math.random() *4);
        var adjustedWidth =  2 +Math.floor(Math.random() * 4);
        processSingleRect(r, rects, adjustedWidth, adjustedHeight)
   
    }
    return rects
}


export const noExpansionClusterGenerator = () => {
    var rects = []
    fill( 5,  5, .95, rects);
    return rects
}


 
const drawRect = (r, color, offset , newGrid) => {
    for (var q = 0; q < r.width; q++) {
        for (var p = 0; p < r.height; p++) {
            var q2 = r.x + q;
            var p2 = r.y + p + offset;

            if (newGrid.getTile(q2, p2) !== undefined) {


                newGrid.getTile(q2, p2).color = color

            }
        }
    }
}
const neighborCount = (rect, rects) => {
    var count = 0;
    if (rects.find((r) => {
        return r.x === rect.x + rect.width & r.y === rect.y
    })) {
        count++;
    }
    
    if (rects.find((r) => {
        return r.x === rect.x  & r.y  === rect.y + rect.height
    })) {
        count++;
    }


    if (rects.find((r) => {
        return r.x + r.width === rect.x & r.y === rect.y
    })) {
        count++;
    }
    
    if (rects.find((r) => {
        return r.y + r.height === rect.y &  r.x === rect.x 
    })) {
        count++;
    }
    return count;
}
 

