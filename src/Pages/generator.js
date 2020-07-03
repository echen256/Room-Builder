import React, { useState } from 'react';
import { Card, Colors, Button, InputGroup, Divider, H1, Popover, H3, NonIdealState } from "@blueprintjs/core"
import Grid from "./../Components/graph"
import GridRenderer from "./../Components/graph_renderer"
import axios from "axios"
import "./../layouts/index";
import Rect from '../Components/rect';

axios.defaults.headers.common = {
    "Content-Type": "application/json"
}


class Prop {

    constructor(width, height, spacingW, spacingH, color) {
        this.width = width;
        this.height = height;
        this.spacingH = spacingH;
        this.spacingW = spacingW;
        this.color = color
    }

    getTotalWidth() {
        return this.width + 2 * this.spacingW;
    }

    getTotalHeight() {
        return this.height + 2 * this.spacingH;
    }
}

function Generator() {


    const width = 50
    const height = 50;


    var newGrid = new Grid({ width, height, rotation: 0 });
        var rects = []
    const fill = (x, y, probability) => {

            newGrid.getTile(x, y).color = Colors.RED1
            rects.push(new Rect(1, 1, x, y));
            for (var i = -1; i < 2; i++) {
                for (var j = -1; j < 2; j++) {
                    if (Math.abs(i) + Math.abs(j) === 1) {
                        if (Math.random() < probability) {

                            fill(x + i, j + y, probability / 2)
                        }
                    }
                }
            }
        }
 
    rects.forEach(element => {
        
        newGrid.getTile(element.x, element.y).color = Colors.RED1 
    });

    const processRects = (rects) => {
        for (var i = 0; i < rects.length; i++) {
            var r = rects[i];
            
            
            var adjustedHeight = 2;// Math.floor(Math.random() * 3);
            var adjustedWidth = 2;//Math.floor(Math.random() * 3);
           
            var upperRightCorner = [r.x + r.width , r.y +r.height ]
          

           

            for (var j = 0; j < rects.length; j++) {
                if (j !== i) {
                    var r2 = rects[j];
                    var minimumCorner = [r2.x , r2.y ]

                    if (minimumCorner[0]  >   upperRightCorner[0]) {
                        r2.x += adjustedWidth
                    }

                    if (minimumCorner[1] >   upperRightCorner[1]) {
                        r2.y += adjustedHeight
                    }
                }

            }

            r.width += adjustedWidth
            r.height += adjustedHeight

            for (var q = 0; q < r.width; q++) {
                for (var p = 0; p < r.height; p++) {
                    var q2 = r.x + q ;
                    var p2 = r.y + p + 10;
                 
                    if (newGrid.getTile(q2,p2) !== undefined){
                        if (newGrid.getTile(q2,p2).color !== Colors.RED1){
                        
                            newGrid.getTile(q2,p2).color = Colors.GREEN1
                        } 
                    }
                }
            }

        }

    }

     fill(25, 25, .75);
    processRects(rects)

  

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
