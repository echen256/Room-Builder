/* eslint-disable */
import React, { useState } from 'react';
import { Card, Colors, Button } from "@blueprintjs/core"

export default function GridRenderer(props ) {

    var grid = props.grid;
    const [update, triggerUpdate] = useState(false)
    var columns = [];
    for (var j = 0; j < grid.height; j++) {
        var row = [];
        for (var i = 0; i < grid.width; i++) {
            var tile = grid.tiles[grid.getIndex(i, j)]

            var key = i + ":" + j;
            row.push(
                <Button
                    key={key}
                    value={JSON.stringify({ x: i, y: j })}
                    onClick={(event) => {
                        grid.editProp(event);
                        triggerUpdate(! update)
                    }} style={{ backgroundColor: tile.color, width: "25px", height: "25px" }}>
                    {key}
                </Button>

            )
        }

        columns.push(<div style={{ display: "flex" }}> {row} </div>)
    }
    columns.reverse();
    return <div>{columns}</div>
}

export class Grid {

    constructor (props) {
        this.rotation = props.currentRotation;
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

        console.log(tile.prop)

        var eraseProp = tile.prop;
        tile.prop.color = Colors.LIGHT_GRAY5
        console.log(eraseProp)
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
            rotation : this.rotation, x, y
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