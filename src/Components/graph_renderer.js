/* eslint-disable */
import React, { useState } from 'react';
import { Card, Colors, Button } from "@blueprintjs/core"
const rotationIndicators = {
    0 : "arrow-right",
    90: "arrow-up",
    180: "arrow-left",
    270: "arrow-down"
}
export default function GridRenderer(props ) {
  
    var grid = props.grid;
    grid.currentProp = props.currentProp;
    const [update, triggerUpdate] = useState(false)
    var columns = [];
    for (var j = 0; j < grid.height; j++) {
        var row = [];
        for (var i = 0; i < grid.width; i++) {
            var tile = grid.tiles[grid.getIndex(i, j)]

            var icon = ""
          
            if (tile.prop !== undefined){ 
                var degrees = tile.prop.degrees; 
                var icon = rotationIndicators[degrees]
            }

            var key = i + ":" + j;
            row.push(
                <Button
                    key={key}
                    icon = {icon}
                    value={JSON.stringify({ x: i, y: j })}
                    onClick={(event) => {
                        grid.editProp(event);
                        triggerUpdate(! update)
                    }} style={{ backgroundColor: tile.color, width: "25px", height: "25px" }}>
                 
                </Button>

            )
        }

        columns.push(<div style={{ display: "flex" }}> {row} </div>)
    }
    columns.reverse();
    return <div>{columns}</div>
}