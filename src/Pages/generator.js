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


    // const width = Math.floor(Math.random() * 7) + 3;
    const width = Math.floor(Math.random() * 5 + 5);
    const height = Math.floor(Math.random() * 5 + 5);
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

    const parseResults = ({ divisionWidth, sectionWidth, divisionCount, rect }, vertical) => {


        var rects = [];
        for (var i = 0; i < divisionCount + 1; i++) {

            if (vertical) {

                rects.push({
                    width: sectionWidth, height: rect.height, x: i * (sectionWidth + divisionWidth) + rect.x, y: rect.y, color: "green"
                })
            } else {
                rects.push({
                    width: rect.width, height: sectionWidth, x: rect.x, y: i * (sectionWidth + divisionWidth) + rect.y, color: "green"
                })
            }
        }
 
        return rects;
    }

    const subdivide = (rect, results, vertical, iterations) => {

        if (iterations < 1) {
            results.push(rect);
            return;
        }
        var width = rect.width;
        var height = rect.height;
        // if ((width < 3 && height < 6) || (width < 6 && height < 3)) {
        //     results.push(rect);
        //     return;
        // }

        let divisionWidths = [1 ,2];
        let minDivisions = 1;
        let maxDivisions = parseInt(Math.round(width / 2));
        let maxSectionWidth = parseInt(Math.round(width / 2));
        let minSectionWidth = 1;

        //division equation = (number of divisions + 1) * section_width + number of divisions * division_width = totalWidth
        //so lets say we are dividng by 20 and the divsion width is 1
        //then the possible solutions are 20 = (1 + 1) * 9 + 1 * 2
        // 20 = (2 +  1) * 6   + 2 * 1

        var possibleSolutions = [];

        for (var i = minSectionWidth; i <= maxSectionWidth; i++) {
            for (var j = minDivisions; j <= maxDivisions; j++) {
                for (var k = 0; k < divisionWidths.length; k++) {


                    var equation = (j + 1) * i + j * divisionWidths[k];

                    var quantity = width;
                    if (!vertical) quantity = height;

                    if (equation === quantity) {
                        possibleSolutions.push({
                            divisionWidth: divisionWidths[k],
                            sectionWidth: i,
                            divisionCount: j,
                            rect
                        })


                    }
                }
            }
        }

        if (possibleSolutions.length === 0) {
            results.push(rect);
            return;
        }

        var nextSolution = possibleSolutions[ Math.floor(Math.random() * possibleSolutions.length  )]

        parseResults(nextSolution, vertical).forEach((result_rect) => {
            subdivide(result_rect, results, result_rect.width > result_rect.height, iterations-1)
        })
    }


    // const PrimeFactorization = (number) => {
    //     let primes = [];
    //     let half = parseInt(Math.floor(number/2))
    //     for (var i = 2; i <= number/2;i++){
    //         while (number/i === 0){
    //             primes.push(i);
    //             num
    //         }
    //     }
    // }


    var rect = { width, height, x: 0, y: 0 };
    var iterations = 3;
    var results = [];
    
    subdivide(rect, results, false, iterations);
    


    var newGrid = new Grid({ width, height, rotation: 0 });

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
