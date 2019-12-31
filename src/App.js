import React, { useState } from 'react';
import { Card, Colors, Button, InputGroup, Divider, H1 } from "@blueprintjs/core"
import { Grid } from "./Components/graph_renderer"
import GridRenderer from "./Components/graph_renderer"

import axios from "axios"

axios.defaults.headers.common = {
  "Content-Type": "application/json"
}

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

function App() {

  const [loading, setLoading] = useState(true);

  const [loadedRooms, updateLoadedRooms] = useState([])
  const [state, setState] = useState({
    grid: new Grid({
      width: 10,
      height: 10,
      currentProp: furniture[0],
      currentRotation: 0
    })
  })

  const setCurrentProp = (prop) => {
    var grid = state.grid;
    grid.currentProp = prop;
    setState({ ...state, grid: grid })
  }

  const setCurrentRotation = (rotation) => {
    var grid = state.grid;
    grid.currentRotation = rotation * Math.PI / 180;
    setState({ ...state, currentRotation: rotation, grid: grid })
  }




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
      rooms: loadedRooms
    }).then((res) => {
      console.log(res)
    })
  }

  const add = (event) => {
    event.preventDefault();
    loadedRooms.push(state.grid.exportGrid())
    updateLoadedRooms([...loadedRooms])
  }

  const changeRoomSize = (event) => {
    event.preventDefault();
    var formData = new FormData(event.currentTarget);
    setState({
      grid: new Grid({
        width: formData.get("width"),
        height: formData.get("height"),
        currentProp: state.grid.currentProp,
        currentRotation: state.grid.currentRotation
      })
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

          <GridRenderer grid={state.grid} />


        </Card>

        <Card style={{ marginLeft: "50px", width: "200px", backgroundColor: Colors.LIGHT_GRAY5 }}>
          <form onSubmit={changeRoomSize} >

            <InputGroup name="width" placeholder="Room Width" defaultValue={state.grid.width}></InputGroup>
            <InputGroup name="height" placeholder="Room Height" defaultValue={state.grid.height}></InputGroup>
            <InputGroup type="submit" />
          </form>

          <Divider />

          <div style={{ display: "flex", flexDirection: "column" }}>
            {
              furniture.map((item) => {
                return <Card
                  className={
                    state.grid.currentProp.name === item.name ? "bp3-dark" : ""
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
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Button icon="eraser" text="Reset" />
            <Button onClick={add} icon="plus" text="Add" />
            <Button onClick={save} icon="save" text="Save" />
          </div>

        </Card>

        <Card style={{ marginLeft: "50px", width: "200px", backgroundColor: Colors.LIGHT_GRAY5 }}>
          {
            loadedRooms.map((room) => {
              return <Card>

                <div>
                  Width : {room.width}
                </div>
                <div>
                  Height : {room.height}
                </div>


              </Card>
            })
          }

        </Card>

      </div>

      <Card style={{ marginTop: "20px" }}>
        <div style={{ margin: "auto", display: "flex  " }}>
          <Button onClick={() => setCurrentRotation(state.currentRotation + 90)} icon="image-rotate-left" />

          <InputGroup value={state.currentRotation} />

          <Button onClick={() => setCurrentRotation(state.currentRotation - 90)} icon="image-rotate-right" />


        </div>
      </Card>

    </div>
  );
}

export default App;
