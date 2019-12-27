import React, { useState } from 'react';
import { Card, Colors, Button } from "@blueprintjs/core"
import { PUBLISH_FUNCTION, LIST_COLUMNS } from '@blueprintjs/icons/lib/esm/generated/iconContents';


export default function Grid(props) {

    const [state, setState] = useState({
        loading: true
    })

    var width = props.width;
    var height = props.height;

    const draw = (tile, color) => {
        tile.color = color;
    }

    const brush = (event) => {
        var tile = JSON.parse(event.currentTarget.value)
        var prop = props.currentProp;

        var rotation = props.currentRotation *  Math.PI / 180;

        if (prop === undefined) return;
        var items = state.items;

        var operations = [];

        
        for (var i = 0; i < prop.width; i++) {
            for (var j = 0; j < prop.height; j++) {

                var rotationX = Math.round( i * Math.cos(rotation) - j * Math.sin(rotation));
                var rotationY = Math.round(i * Math.sin(rotation) + j * Math.cos(rotation));

                console.log(i,j,rotationX, rotationY, rotation)

                var item = getItem(rotationX + tile.x, rotationY + tile.y);
                if (item === undefined) return;

                operations.push({ item: item, color: prop.color })

            }
        }

        operations.forEach(data => {
            draw(data.item, data.color)
        });

        setState({
            loading: false, items
        })
    }

    const reset = () => {
        
    }


    const getItem = (x, y) => {
        var index = getIndex(x, y);
        if (index < 0) return undefined;
        return state.items[index]
    }

    const getIndex = (x, y) => {
        if (x < 0 || x >= width) return -1;
        if (y < 0 || y >= height) return -1;
        var index = x + y * width;
        if (index >= state.items.length) return -1;
        return index;
    }

    if (state.loading) {
        var items = [];
        for (var j = 0; j < height; j++) {
            for (var i = 0; i < width; i++) {
                items.push(
                    {
                        x: i, y: j, color: Colors.LIGHT_GRAY1
                    }
                )
            }
        }
        setState({
            loading: false, items: items
        })
    } else {

        var columns = [];
        for (var j = 0; j < height; j++) {


            var row = [];
            for (var i = 0; i < width; i++) {
                var tile = state.items[getIndex(i, j)]
                var key = tile.x + ":" + tile.y;


                row.push(
                    <Button
                        key={key}
                        value={JSON.stringify(tile)}
                        onClick={brush
                        } style={{ backgroundColor: tile.color, width: "25px", height: "25px" }}>
                        {key}
                    </Button>

                )
            }

            columns.push(<div style={{ display: "flex" }}> {row} </div>)
        }
        columns.reverse();
        return columns
    }





}