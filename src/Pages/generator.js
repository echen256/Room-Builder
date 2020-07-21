import React, { useState } from 'react';
import { Card, Colors, Button, InputGroup, Divider, H1, Popover, H3, NonIdealState } from "@blueprintjs/core"
import Grid from "./../Components/graph"
import GridRenderer from "./../Components/graph_renderer"
import axios from "axios"
import "./../layouts/index";
import Rect from '../Components/rect';
import {generateDungeon} from "./../Components/basic-dungeon-generator"
import Edge from '../Geometry/Edge';
import Point from '../Geometry/Point';
 

axios.defaults.headers.common = {
    "Content-Type": "application/json"
}


 

function Generator() {

    const width = 50
    const height = 50;
    var newGrid = new Grid({ width, height, rotation: 0 });

    var dungeonData = generateDungeon();

    dungeonData.cluster.forEach((rect) => {
        for (var i = 0; i < rect.width;i++){
            for (var j = 0; j < rect.height;j++){
                newGrid.getTile(i + rect.x, j + rect.y).color = Colors.RED1
            }
        }
    })
    

     dungeonData.prunedEdges.forEach((edge) => {
        var points = edge.getPoints();
        points.forEach((p3) => {
            newGrid.getTile(p3.x,p3.y).color = Colors.GREEN1;
        })
     })

    return (
        <div style={{ margin: "auto", marginTop: "100px", width: "fit-content" }}>
            <Button  >
                Subdivide
            </Button>
            <div><GridRenderer grid={newGrid} /><br /></div>
        </div>
    );
}



export default Generator;
