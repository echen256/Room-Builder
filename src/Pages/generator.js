import React, { useState } from 'react';
import { Card, Colors, Button, InputGroup, Divider, H1, Popover, H3, NonIdealState } from "@blueprintjs/core"
import Grid from "./../Components/graph"
import GridRenderer from "./../Components/graph_renderer"
import axios from "axios"
import "./../layouts/index";
import Rect from '../Components/rect';
 

axios.defaults.headers.common = {
    "Content-Type": "application/json"
}


 

function Generator() {

    const width = 30
    const height = 30;
    var newGrid = new Grid({ width, height, rotation: 0 });

    return (
        <div style={{ margin: "auto", marginTop: "100px", width: "fit-content" }}>
            <Button  >
                Subdivide
            </Button>
            <div><GridRenderer grid={newGrid} /><br /></div>
        </div>
    );
}



export default Generator;
