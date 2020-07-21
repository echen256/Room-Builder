
import React, { useState } from 'react';
import { Card, Colors, Button } from "@blueprintjs/core"
import Rect from "./rect"
import Tile from "./Tile"

export default  class Grid {
    setRotation = (degrees) => {
        degrees = degrees % 360;
        this.rotation = this.getRadians(degrees)
        this.degrees = degrees;
    }

    getRadians = (degrees) => {
        return degrees  * Math.PI / 180;
    }

    constructor (props) { 

        this.setRotation(props.rotation);
        this.addedProps = [];
        this.width = props.width;
        this.height = props.height;
        this.currentProp = props.currentProp;
        this.boundingRect = new Rect(this.width,this.height,0,0);
       
        this.tiles = [];
        for (var j = 0; j < props.height; j++) {
            for (var i = 0; i < props.width; i++) {
                this.tiles.push(
                    new Tile(i,j)
                )
            }
        } 
    }
    
    loadRoom = (room) => {
       
        this.width = room.width;
        this.height = room.height;
        this.addedProps = room.addedProps;
        this.tiles = [];
        for (var j = 0; j < room.height; j++) {
            for (var i = 0; i < room.width; i++) {
                this.tiles.push(
                    {
                        x: i, y: j, color: Colors.LIGHT_GRAY5
                    }
                )
            }
        }
        this.addedProps.forEach((prop) => { 
            this.currentProp = prop;
            this.rotation = prop.rotation;
            this.addProp(prop ,   prop.position )
        })
    }
  
    exportGrid = () => {

        return {
            addedProps : this.addedProps,
            width : this.width,
            height : this.height
        }
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