import React, { useState } from 'react';
import { Card, Colors, Button, InputGroup, Divider, H1 } from "@blueprintjs/core"
import { Grid } from "./Components/graph_renderer"
import GridRenderer from "./Components/graph_renderer"

import axios from "axios"

axios.defaults.headers.common = {
  "Content-Type": "application/json"
}
function App() {

  const [loading, setLoading] = useState(true);




  const [state, setState] = useState({
    width: 10,
    height: 10
  })

  var furniture = [
    {
      width: 2,
      height: 2,
      name: "Bed",
      color: Colors.BLUE1
    },
    {
      width: 1,
      height: 1,
      name: "Wardrobe",
      color: Colors.INDIGO1
    },
    {
      width: 2,
      height: 1,
      name: "Desk",
      color: Colors.RED1
    },
    {
      width: 1,
      height: 1,
      name: "Drawer Cabinet",
      color: Colors.GREEN1
    },
    {
      width: 1,
      height: 1,
      name: "End Table",
      color: Colors.GOLD1
    },
    {
      width: 1,
      height: 1,
      name: "Erase",
      color: Colors.LIGHT_GRAY5
    }
  ]

  const [currentProp, setCurrentProp] = useState(furniture[0])
  const [currentRotation, setCurrentRotation] = useState(0)

  const [loadedRooms, updateLoadedRooms] = useState([])
  const grid = new Grid({
    currentRotation: currentRotation,
    currentProp: currentProp,
    width: state.width,
    height: state.height
  });

  if (loading) {
    axios.get("http://127.0.0.1:3001/load", {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    }).then((res) => {
      console.log(res)
      setLoading(false)

      updateLoadedRooms(res.data)
    })

    return <div />
  }
  const save = (event) => {
    event.preventDefault();
    axios.post("http://127.0.0.1:3001/save", {
      rooms : loadedRooms
    }).then((res) => {
      console.log(res)
    })
  }

  






  const changeRoomSize = (event) => {
    event.preventDefault();
    var formData = new FormData(event.currentTarget);
    setState({
      width: formData.get("width"),
      height: formData.get("height"),
      grid: state.grid
    })
  }


  return (
    <div style={{ margin: "100px" }}>
      <div style={{ display: "flex" }}>

        <Card
          style={{
            backgroundColor: Colors.LIGHT_GRAY5
          }}
        >

          <GridRenderer grid={grid} />


        </Card>

        <Card style={{ marginLeft: "50px", width: "200px", backgroundColor: Colors.LIGHT_GRAY5 }}>
          <form onSubmit={changeRoomSize} >

            <InputGroup name="width" placeholder="Room Width" defaultValue={state.width}></InputGroup>
            <InputGroup name="height" placeholder="Room Height" defaultValue={state.height}></InputGroup>
            <InputGroup type="submit" />
          </form>

          <Divider />

          <div style={{ display: "flex", flexDirection: "column" }}>
            {
              furniture.map((item) => {
                return <Card
                  className={
                    currentProp.name === item.name ? "bp3-dark" : ""
                  }
                  onClick={() =>
                    setCurrentProp(item)
                  }

                  style={{ display: "flex", padding: "5px", marginBottom: "10px" }}>
                  <Card style={{ backgroundColor: item.color, padding: "0px", width: "20px", height: "20px" }} />
                  <div style={{ marginLeft: '10px' }}>
                    {item.name}
                  </div>
                </Card>
              })
            }
          </div>


          <Divider />

          <Button icon="eraser" text="Reset" />

          <Button onClick = {save}icon="floppy" text="Save" />
        </Card>

        <Card style={{ marginLeft: "50px", width: "200px", backgroundColor: Colors.LIGHT_GRAY5 }}>
          {
            loadedRooms.map((room) => {
              return <Card>
                {
                  room.x
                }
              </Card>
            })
          }

        </Card>

      </div>

      <Card style={{ marginTop: "20px" }}>
        <div style={{ margin: "auto", display: "flex  " }}>
          <Button onClick={() => setCurrentRotation(currentRotation + 90)} icon="image-rotate-left" />

          <InputGroup value={currentRotation} />

          <Button onClick={() => setCurrentRotation(currentRotation - 90)} icon="image-rotate-right" />


        </div>
      </Card>

    </div>
  );
}

export default App;
