/* eslint-disable */
import React, { useState } from 'react';
import { Card, Colors, Button } from "@blueprintjs/core"

export default function Grid(props ) {

    const [state, setState] = useState({
        loading: true,
        addedProps: []
    })

    const rotation = props.currentRotation * Math.PI / 180;
    const [addedProps, setAddedProps] = useState([])

    const editProp = (event) => {
        var position = JSON.parse(event.currentTarget.value);
        var x = position.x;
        var y = position.y;
        var tile = getTile(x, y);
        if (tile.prop !== undefined) {
            deleteProp(position)
        } else {
            addProp(position)
        }
    }

    const deleteProp = (position) => {
        var tile = getTile(position.x, position.y);
        var list = [...addedProps];
        list = addedProps.filter((item) => {
            return item.x !== position.x && item.y !== position.y
        });

        var eraseProp = {
            rotation : rotation, x : position.x, y : position.y, color : Colors.LIGHT_GRAY5, width : tile.prop.width, height : tile.prop.height, prop : undefined
        }
        setAddedProps(list)
        brush(eraseProp, true)
    }

    const exportRoom = () => {
        return {
            props : addedProps,
            width : props.width,
            height : props.height
        }
    }

    const addProp = (position) => {
        var list = [...addedProps];
        var x = position.x;
        var y = position.y;
        var prop = props.currentProp;
        for (var i = 0; i < prop.width; i++) {
            for (var j = 0; j < prop.height; j++) {
                var rotationX = Math.round(i * Math.cos(rotation) - j * Math.sin(rotation));
                var rotationY = Math.round(i * Math.sin(rotation) + j * Math.cos(rotation));
                var tile = getTile(rotationX + x, rotationY + y);
                if (tile === undefined) return;
                if (tile.prop !== undefined) return
            }
        }

        var newProp = {
            rotation : rotation, x, y, color : prop.color, width : prop.width, height : prop.height, prop : prop
        }

        list.push(newProp);
        setAddedProps(list);
        brush(newProp, false);
    }


    var width = props.width;
    var height = props.height;



    const brush = (data, erasing) => {
        var operations = [];
        for (var i = 0; i < data.width; i++) {
            for (var j = 0; j < data.height; j++) {
                var rotationX = Math.round(i * Math.cos(data.rotation) - j * Math.sin(data.rotation));
                var rotationY = Math.round(i * Math.sin(data.rotation) + j * Math.cos(data.rotation));
                var tile = getTile(rotationX + data.x, rotationY + data.y);
                if (tile === undefined) return;
                operations.push({ tile, color: data.color })

            }
        }


        operations.forEach((operation) => {
            operation.tile.color = operation.color;

            if (erasing) {
                operation.tile.prop = undefined

            } else {
                operation.tile.prop = data.prop;
            }
        });

    }

    const getTile = (x, y) => {
        var index = getIndex(x, y);
        if (index < 0) return undefined;
        return state.tiles[index]
    }

    const getIndex = (x, y) => {
        if (x < 0 || x >= width) return -1;
        if (y < 0 || y >= height) return -1;
        var index = x + y * width;
        if (index >= state.tiles.length) return -1;
        return index;
    }

    if (state.loading) {
        var tiles = [];
        for (var j = 0; j < height; j++) {
            for (var i = 0; i < width; i++) {
                tiles.push(
                    {
                        x: i, y: j, color: Colors.LIGHT_GRAY5
                    }
                )
            }
        }
        setState({
            loading: false, tiles
        })
        return <div />
    }

    const renderGrid = () => {

        var columns = [];


        for (var j = 0; j < height; j++) {
            var row = [];
            for (var i = 0; i < width; i++) {
                var tile = state.tiles[getIndex(i, j)]

                var key = i + ":" + j;
                row.push(
                    <Button
                        key={key}
                        value={JSON.stringify({ x: i, y: j })}
                        onClick={editProp} style={{ backgroundColor: tile.color, width: "25px", height: "25px" }}>
                        {key}
                    </Button>

                )
            }

            columns.push(<div style={{ display: "flex" }}> {row} </div>)
        }
        columns.reverse();
        return <div>{columns}</div>
    }


    return <div>
        {renderGrid()}
    </div>





}