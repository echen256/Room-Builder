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
    const [update, triggerUpdate] = useState(false)
    var columns = [];
    for (var j = 0; j < grid.height; j++) {
        var row = [];
        for (var i = 0; i < grid.width; i++) {
            var tile = grid.tiles[grid.getIndex(i, j)]

            var icon = ""
          
            if (tile.prop !== undefined){
                console.log(tile.prop)
                var degrees = tile.prop.degrees;
                console.log(degrees)
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

export class Grid {
    setRotation = (degrees) => {
        degrees = degrees % 360;
        this.rotation = degrees  * Math.PI / 180
        this.degrees = degrees;
    }

    constructor (props) {
         this.setRotation(props.rotation);
        this.addedProps = [];
        this.width = props.width;
        this.height = props.height;
        this.currentProp = props.currentProp;
       
        this.tiles = [];
        for (var j = 0; j < props.height; j++) {
            for (var i = 0; i < props.width; i++) {
                this.tiles.push(
                    {
                        x: i, y: j, color: Colors.LIGHT_GRAY5
                    }
                )
            }
        }
        Math.sin()
    }
    
  
    exportGrid = () => {
        return {
            addedProps : this.addedProps,
            width : this.width,
            height : this.height
        }
    }

    editProp = (event) => {
        var position = JSON.parse(event.currentTarget.value);
      
        var x = position.x;
        var y = position.y;
        var tile = this.getTile(x, y);
        if (tile.prop !== undefined) {
            this.deleteProp(position)
        } else {
            this.addProp(position)
        }
    }

    deleteProp = (position) => {
        var tile = this.getTile(position.x, position.y);
        var list = [...this.addedProps];
        list = this.addedProps.filter((item) => {
            return item.x !== position.x && item.y !== position.y
        });

        var eraseProp = tile.prop;
        tile.prop.color = Colors.LIGHT_GRAY5
        this.addedProps = (list)
        this.brush(eraseProp, true)
    }



    addProp = (position) => {
        var list = [...this.addedProps];
        var x = position.x;
        var y = position.y;
        var prop = this.currentProp;
        for (var i = 0; i < prop.width; i++) {
            for (var j = 0; j < prop.height; j++) {
                var rotationX = Math.round(i * Math.cos(this.rotation) - j * Math.sin(this.rotation));
                var rotationY = Math.round(i * Math.sin(this.rotation) + j * Math.cos(this.rotation));
                var tile = this.getTile(rotationX + x, rotationY + y);
              
                if (tile === undefined) return;
                if (tile.prop !== undefined) return
            }
        }

        var newProp = {...prop,
            rotation : this.rotation, x, y , degrees : this.degrees
        }

        list.push(newProp);
        this.addedProps = list;
        this.brush(newProp, false);
    }

    brush = (data, erasing) => {
        var operations = [];
        for (var i = 0; i < data.width; i++) {
            for (var j = 0; j < data.height; j++) {
                var rotationX = Math.round(i * Math.cos(data.rotation) - j * Math.sin(data.rotation));
                var rotationY = Math.round(i * Math.sin(data.rotation) + j * Math.cos(data.rotation));
                var tile = this.getTile(rotationX + data.x, rotationY + data.y);
                if (tile === undefined) return;
                operations.push({ tile, color: data.color })

            }
        }


        operations.forEach((operation) => {
            operation.tile.color = operation.color;

            if (erasing) {
                operation.tile.prop = undefined

            } else {
                operation.tile.prop = data;
            }
        });

    }

    getTile = (x, y) => {
        var index = this.getIndex(x, y);
        if (index < 0) return undefined;
        return this.tiles[index]
    }

    getIndex = (x, y) => {
      
        if (x < 0 || x >= this.width) return -1;
        if (y < 0 || y >= this.height) return -1;
        var index = x + y * this.width;
        if (index >= this.tiles.length) return -1;
        return index;
    }



}