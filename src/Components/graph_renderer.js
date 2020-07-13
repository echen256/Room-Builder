/* eslint-disable */
import { Colors, Button , Icon} from "@blueprintjs/core";
import React, { useState } from 'react';
import Rect from "./rect"

const rotationIndicators = {
    0: "arrow-right",
    90: "arrow-up",
    180: "arrow-left",
    270: "arrow-down"
}
export default function GridRenderer(props) {
  
    var grid = props.grid; 
    const [update, triggerUpdate] = useState(false)
    var columns = [];
    for (var j = 0; j < grid.height; j++) {
        var row = [];
        for (var i = 0; i < grid.width; i++) {
            var tile = grid.tiles[grid.getIndex(i, j)]
 

            var key = i + ":" + j;
            row.push(
                <button
                    key={key} 
                    value={JSON.stringify({prop : props.currentProp, position : { x: i, y: j }})}
                    style={{ zIndex : 1,backgroundColor: tile.color, color : "black",width: "25px", 
                    height: "25px", borderWidth: "1px", borderColor: Colors.GRAY1, borderStyle: "solid    " }}>

                </button>

            )
        }

        columns.push(<div style={{ display: "flex" }}> {row} </div>)
    }
    columns.reverse(); 
    var pixelWidth = 25 * grid.width ;
    var pixelHeight = 25 * grid.height  ; 

    const getOverlay = (prop,index) =>{
        var rect = new Rect(prop.rect.width,prop.rect.height, prop.rect.x,prop.rect.y);
        rect =  rect.getRotatedRect(prop.rotation)
      
         return <div style={{ 
            position: "absolute",
            zIndex: 2,
            backgroundColor: prop.color,
            color: prop.color,
            width: 25 * rect.width + "px",
            height: 25 *rect.height+ "px",
            bottom : rect.y * 25 + "px", 
            left: (25 *  rect.x) + "px",
            borderWidth: "1px", borderColor: Colors.GRAY1, borderStyle: "solid    "
        }}>
            <div>

           
            <Icon style = {{width : "fit-content", margin : "auto", color : "white"}} icon = {rotationIndicators[prop.degrees]}/>
            <Icon minimal style = {{zIndex : 3, pointerEvents: "visible", margin : "auto", color : "white"}}icon = "trash" onClick = {
                    () => {
                        console.log(index)
                        grid.addedProps.splice(index,1);
                        triggerUpdate(!update)
                    }
            }/>
             </div>
            </div>
    }
    return <div>
        <div>{columns}


            <div style={{ pointerEvents :'none',width : pixelWidth + "px", height : pixelHeight+ "px",   position: "relative", top : -pixelHeight+ "px", backgroundColor : Colors.RED1 }}>
            {
                grid.addedProps.map((prop, index) => {
                     return getOverlay(prop,index)
                })
            }
            </div>
            

           

        
        </div>


    </div>
}
 
