
import React, { useState } from 'react';
import { Card, Colors, Button } from "@blueprintjs/core"
import Rect from "./rect"

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
                    {
                        x: i, y: j, color: Colors.LIGHT_GRAY5
                    }
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
 
 
    addProp = (prop,position) => {   

        var rect = new Rect(prop.width,prop.height, position.x,position.y);
   
        rect = rect.getRotatedRect(this.rotation);
        
        
        var canAdd = this.boundingRect.contains(rect); 
        this.addedProps.forEach((addedProp) => {
            var addedRect = new Rect(addedProp.rect.width, addedProp.rect.height, addedProp.rect.x, addedProp.rect.y)
            var rotatedProp = addedRect.getRotatedRect(addedProp.rotation);
            if ( rotatedProp.overlaps(rect)) {
                canAdd = false;
            }
        })

        if (canAdd){
            this.addedProps.push({
                ...prop, rect, ...{position}, rotation : this.rotation, degrees : this.degrees
            })
        }
    }


   addPropEvent = (event) => {
        var props = JSON.parse(event.target.value)
         this.addProp(props.prop,props.position);
    }

    deleteProp = (position) => {
        var tile = this.getTile(position.x, position.y);
        var list = [...this.addedProps];
        list = this.addedProps.filter((item) => {
            console.log(item.points)
            let point_intersection = item.points.filter((point) => {
                return point.x !== position.x && point.y !== position.y
            })
            return point_intersection.length === 0;
            //return item.x !== position.x && item.y !== position.y
        });

        var eraseProp = tile.prop;
        tile.prop.color = Colors.LIGHT_GRAY5
        this.addedProps = (list)
        this.brush(eraseProp, true)
    }

 
    // brush = (data, erasing) => {
    //     var operations = [];
    //     for (var i = 0; i < data.width; i++) {
    //         for (var j = 0; j < data.height; j++) {
    //             var rotationX = Math.round(i * Math.cos(data.rotation) - j * Math.sin(data.rotation));
    //             var rotationY = Math.round(i * Math.sin(data.rotation) + j * Math.cos(data.rotation));
    //             var tile = this.getTile(rotationX + data.x, rotationY + data.y);
    //             if (tile === undefined) return;
    //             operations.push({ tile, color: data.color })

    //         }
    //     }
    //     operations.forEach((operation) => {
    //         operation.tile.color = operation.color;

    //         if (erasing) {
    //             operation.tile.prop = undefined

    //         } else {
    //             operation.tile.prop = data;
    //         }
    //     });

    // }

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