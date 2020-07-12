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


    const width = 100
    const height = 100;


    var newGrid = new Grid({ width, height, rotation: 0 });
  
    var rects = []

    rects.forEach((r) => {
        for (var q = 0; q < r.width; q++) {
            for (var p = 0; p < r.height; p++) {
                var q2 = r.x + q;
                var p2 = r.y + p;

                if (newGrid.getTile(q2, p2) !== undefined) {

                    newGrid.getTile(q2, p2).color = Colors.RED1

                }
            }
        }

    })

    const fill = (x, y, probability) => {

        newGrid.getTile(x, y).color = Colors.RED1
        rects.push(new Rect(1, 1, x, y));
        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                if (Math.abs(i) + Math.abs(j) === 1) {
                    if (Math.random() < probability) {

                        fill(x + i, j + y, 3 * probability / 5)
                    }
                }
            }
        }
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

    const drawRect = (r, color, offset) => {
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

    const insertTemplate = (rects)=> {
        
        let paths = [];
        let nonPaths = [];
        let allRects = [];
        for (var i = 0; i < rects.length; i++) {
            var r = rects[i];


            for (var j = 0; j < 3;j++){
                for (var k = 0; k < 3;k++){
                    let r2 = new Rect(1,1,r.x * 3 + j, r.y * 3 + k);
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
            allRects
        }
    }

    const processRects = (rects) => {
        for (var i = 0; i < rects.length; i++) {
            var r = rects[i];


            var adjustedHeight = 2;//2 + Math.floor(Math.random() * 2);
            var adjustedWidth = 2;//2 +Math.floor(Math.random() * 2);

            processSingleRect(r, rects, adjustedWidth, adjustedHeight)


        }

    }

    const insertSinglePath = (pathRect, rects) => {
        let newWidth = 1;
        let newHeight = 1;
        for (var i = 0; i < rects.length;i++){
            let rect = rects[i]
            if (rect.x >= pathRect.x  ){
                rect.x += newWidth
            }

            if (rect.y >= pathRect.y  ){
                rect.y += newHeight
            }
        }


        
        pathRect.width = Math.max(pathRect.width,1)
        pathRect.height = Math.max(pathRect.height,1)
    }

    const insertPaths = (rects) => {
        var rectPaths = []
        for (var i = 0; i < rects.length; i++) {
            var r = rects[i];
            rectPaths.push(new Rect(r.width, 0, r.x, r.y + r.height))
            rectPaths.push(new Rect(0, r.height, r.x + r.width, r.y))
        }

        for (var i = 0; i < rectPaths.length; i++) {
            let r = rectPaths[i]
            
            insertSinglePath(r,rects)
            console.log(r)
             drawRect(r, Colors.GOLD1, 10)
        }

        rects.concat(rectPaths)
        //rects .concat(rectPaths)


        // var totalRects = [...rects]
        // totalRects.concat(rectPaths);
        // for (var i = 0; i < rectPaths.length;i++){
        //     let r = rectPaths[i]
        //     console.log(r)
        //     processSingleRect(rectPaths[i], totalRects, Math.max(1, r) , Math.max(1,r))

        //     drawRect(r,Colors.GOLD1, 10)
        // }
    }

    fill( 5,  5, .95);
    
    let output = insertTemplate(rects);
    for (var i = 0; i < output.nonPaths.length; i++) {
        var r = output.nonPaths[i];


        var adjustedHeight =  2 + Math.floor(Math.random() *4);
        var adjustedWidth =  2 +Math.floor(Math.random() * 4);

        processSingleRect(r, output.allRects, adjustedWidth, adjustedHeight)
   

    }

    for (var i = 0; i < output.paths.length; i++) {
        var r = output.paths[i];


        var adjustedHeight = r.height;
        var adjustedWidth =  r.width;

        if (adjustedHeight > adjustedWidth){
            adjustedWidth = Math.round(Math.random() )  + 1
        } else if (adjustedWidth > adjustedHeight){
            adjustedHeight  = Math.round(Math.random() )  + 1
        }

        processSingleRect(r, output.allRects, adjustedWidth, adjustedHeight)
   

    }
 
    output.paths.forEach((r) => {
        drawRect(r, Colors.GOLD1, 10)
    })
    output.nonPaths.forEach((r) => {
        drawRect(r, Colors.GREEN1, 10)
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
