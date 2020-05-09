
import React, { useState } from 'react';
import { Card, Colors, Button } from "@blueprintjs/core"

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
            this.addProp(prop)
        })
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



    addProp = (position) => {
       
        var list = [...this.addedProps];
        var x = position.x;
        var y = position.y;
        var prop = this.currentProp;  
        let valid = true;
        let rotation = this.getRadians(this.degrees)
        console.log(this.degrees)
        console.log(rotation)
        let points = []
        for (var i = 0; i < prop.width; i++) {
            for (var j = 0; j < prop.height; j++) {

                var rotationX = Math.round(i * Math.cos(rotation) - j * Math.sin(rotation));
                var rotationY = Math.round(i * Math.sin(rotation) + j * Math.cos( rotation));
                var tile = this.getTile(rotationX + x, rotationY + y);
                points.push(tile)
                if (tile === undefined) valid = false;
                else  if (tile.prop !== undefined) valid = false;
            }
        }

        console.log(valid)
        if (!valid )return;
        var newProp = {...prop,
            rotation : rotation, x, y , degrees : this.degrees, 
            points
        }

        list.push(newProp);
        this.addedProps = list;
        this.brush(newProp, false);

        console.log(newProp, this.addedProps)
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