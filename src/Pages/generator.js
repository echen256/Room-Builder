import React, { useState } from 'react';
import { Card, Colors, Button, InputGroup, Divider, H1, Popover, H3, NonIdealState } from "@blueprintjs/core"
import Grid from "./../Components/graph"
import GridRenderer from "./../Components/graph_renderer"
import axios from "axios"
import "./../layouts/index";

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


    const width = Math.floor(Math.random() * 6 + 3);
    const height = Math.floor(Math.random() * 6 + 3);
    var minWidth = 1;
    var minHeight = 1;
    var maxHeight = 4;
    var maxWidth = 4;
    var maxArea = 6;

    var rect = { width, height, x: 0, y: 0 };
    var iterations = 10;
    var results = [];


    var newGrid = new Grid({ width, height, rotation: 0 });

    const [state, setState] = useState({
        loading: true,
        rotation: 0,
        furniture: [],
        loadedRooms: [],
        grid: new Grid({
            width,
            height,
            rotation: 0
        })
    })

    const parseResults = (rect, divisionWidth, vertical) => {

        var rects = [];
        var area = rect.width * rect.height


        if (rect.width === minWidth && area > maxArea) {
            vertical = true;
        } else if (rect.height === minHeight && area > maxArea) {
            vertical = false
        } else if (area <= maxArea) {
            rects.push(rect)
            return rects;
        }


        if (vertical) {
            var w = Math.max(minWidth, Math.floor(Math.random() * rect.width / 2));

            rects.push({
                width: w, height: rect.height, x: rect.x, y: rect.y, color: "green"
            })
            rects.push({
                width: rect.width - w - divisionWidth, height: rect.height, x: w + rect.x + divisionWidth, y: rect.y, color: "green"
            })
        } else {
            var h = Math.max(minHeight, Math.floor((Math.random() * rect.height / 2) + (rect.height / 4)));

            rects.push({
                width: rect.width, height: h, x: rect.x, y: rect.y, color: "green"
            })
            rects.push({
                width: rect.width, height: rect.height - h - divisionWidth, x: rect.x, y: rect.y + h + divisionWidth, color: "green"
            })

        }

        return rects;
    }

    const subdivide = (rect, results, vertical, iterations) => {

        if (iterations < 1) {
            results.push(rect);
            return;
        }


        var subdivsions = parseResults(rect, 1, vertical);
        if (subdivsions.length === 1) {
            results.push(subdivsions[0]);
            return;
        }

        subdivsions.forEach((result_rect) => {
            subdivide(result_rect, results, result_rect.width > result_rect.height, iterations - 1)
        })
    }





    subdivide(rect, results, false, iterations);


    results.map((rect) => {


        for (var i = 0; i < rect.width; i++) {
            for (var j = 0; j < rect.height; j++) {
                newGrid.getTile(i + rect.x, j + rect.y).color = rect.color;
            }
        }
    })

    return (
        <div style={{ margin: "auto", marginTop: "100px", width: "fit-content" }}>
            <Button  >
                Subdivide
            </Button>
            <div><GridRenderer currentProp={state.currentProp} grid={newGrid} /><br /></div>


        </div>
    );
}



export default Generator;
