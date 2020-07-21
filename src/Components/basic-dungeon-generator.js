import {basicClusterGenerator, fill} from "./cluster-generator"
import Edge from "./../Geometry/Edge"
import Point from "./../Geometry/Point"
import Prims from "./../Geometry/Prims"


export const generateDungeon = () => {
    let cluster = basicClusterGenerator()
    let edges = [];
    console.log(cluster)
    cluster.forEach((rect) => {
        var upper = new Point(rect.x, rect.y + rect.height)
        var right = new Point(rect.x + rect.width, rect.y);
        var upperNeighbor = cluster.find((r) => {
            return r.x === upper.x && r.y === upper.y
        })
        var rightNeighbor = cluster.find((r) => {
            return r.x === right.x && r.y === right.y
        })
     
        if (upperNeighbor){
            edges.push(new Edge 
                (
                    new Point(parseInt(rect.x + rect.width/2), parseInt(rect.y + rect.height/2)), 
                    new Point(parseInt(upperNeighbor.x + upperNeighbor.width/2), parseInt(upperNeighbor.y + upperNeighbor.height/2))
            ))
        };
        if (rightNeighbor){
            edges.push(new Edge 
                (
                    new Point(parseInt(rect.x + rect.width/2), parseInt(rect.y + rect.height/2)), 
                    new Point(parseInt(rightNeighbor.x + rightNeighbor.width/2), parseInt(rightNeighbor.y + rightNeighbor.height/2))
            ))
        };
    })
    console.log(edges)
    var prims = new Prims();
    var prunedEdges =   prims.calculate(edges);


    return {
        prunedEdges,
        cluster,
        edges
    }

}

