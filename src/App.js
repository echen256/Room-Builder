import React, { useState } from 'react';
import { Card, Colors, Button, InputGroup, Divider, H1, Popover, H3 } from "@blueprintjs/core"
import { Grid } from "./Components/graph_renderer"
import GridRenderer from "./Components/graph_renderer"
import axios from "axios"

axios.defaults.headers.common = {
  "Content-Type": "application/json"
}
var rotationIndicators = {
  0: "arrow-right",
  90: "arrow-up",
  180: "arrow-left",
  270: "arrow-down"
}

function App() {


  const [state, setState] = useState({
    loading: true,
    rotation: 0,
    furniture: [],
    loadedRooms: [],
    grid: new Grid({
      width: 10,
      height: 10,
      rotation: 0
    })
  })

  const setCurrentProp = (prop) => {
    var grid = state.grid;
    grid.currentProp = prop;
    setState({ ...state, grid: grid })
  }

  const setRotation = (rotation) => {
    if (rotation < 0) {
      rotation = 270
    }
    var grid = state.grid;

    grid.setRotation(rotation)
    setState({ ...state, rotation, grid: grid })
  }

  const updateLoadedRooms = (rooms) => {
    setState({
      ...state, ...{
        loadedRooms: rooms
      }
    })
  }



  if (state.loading) {
    axios.get("/api/load", {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    }).then((res) => {
      console.log(res)
      var grid = state.grid;
      grid.currentProp = res.data.props[0];
      setState(
        {
          ...state
          , ...{
            loading: false,
            furniture: res.data.props,
            loadedRooms: res.data.rooms,
            currentProp: res.data.props,
            grid: grid
          }
        }
      )
    })

    return <div />
  }
  const save = (event) => {
    event.preventDefault();
    axios.post("/api/save", {
      rooms: state.loadedRooms,
      props: state.furniture
    }).then((res) => {
      console.log(res)
    })
  }

  const add = (event) => {
    event.preventDefault();
    var loadedRooms = state.loadedRooms;
    loadedRooms.push(state.grid.exportGrid())
    updateLoadedRooms([...loadedRooms])
  }

  const changeRoomSize = (event) => {
    event.preventDefault();
    var formData = new FormData(event.currentTarget);
    setState({
      ...state, ...{
        rotation: state.rotation,
        grid: new Grid({
          width: formData.get("width"),
          height: formData.get("height"),
          currentProp: state.grid.currentProp,
          rotation: state.grid.rotation
        })
      }

    })
  }

  const addFurniturePreset = (event) => {
    event.preventDefault();
    var formData = new FormData(event.currentTarget);
    var furniturePreset = {
      width: formData.get("width"),
      height: formData.get('height'),
      name: formData.get('name'),
      color: formData.get('color')
    }
    state.furniture.push(furniturePreset)
    setState({
      ...state, ...{
        furniture: state.furniture

      }

    })
  }


  const PropDisplay = (props) => {
    var item = props.item;
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
  }

  return (
    <div style={{ margin: "100px" }}>
      <div style={{ display: "flex" }}>

        <Card
          style={{
            backgroundColor: Colors.LIGHT_GRAY5
          }}
        >

       
            <div style={{ margin: "auto", display: "flex  " }}>
              <Button onClick={() => setRotation(state.rotation + 90)} icon="image-rotate-left" />
              {
                console.log(state.rotation % 360)
              }
              <Button icon={rotationIndicators[state.rotation % 360]} />

              <Button onClick={() => setRotation(state.rotation - 90)} icon="image-rotate-right" />


            </div>
        



          <Divider />

          <GridRenderer grid={state.grid} />


        </Card>

        <Card style={{ marginLeft: "50px", width: "200px", backgroundColor: Colors.LIGHT_GRAY5 }}>
          <form onSubmit={changeRoomSize} >

            <InputGroup name="width" placeholder="Room Width" defaultValue={state.grid.width}></InputGroup>
            <br />
            <InputGroup name="height" placeholder="Room Height" defaultValue={state.grid.height}></InputGroup>
            <br />
            <InputGroup type="submit" />
          </form>

          <Divider />

          <div style={{ display: "flex", flexDirection: "column" }}>
            {
              state.furniture.map((item) => {
                return PropDisplay({ item: item })
              })
            }

            <Popover>
              <Button fill icon="plus" text="Add Prop" >  </Button>
              <Card>
                <form onSubmit={addFurniturePreset}>
                  <InputGroup name="width" placeholder="Width..." />
                  <br />
                  <InputGroup name="height" placeholder="Height" />
                  <br />
                  <InputGroup name="name" placeholder="Name..." />
                  <br />
                  <InputGroup name="color" placeholder="Color Hex..." />
                  <br />
                  <InputGroup type="submit" value="Save Prop" />
                </form>

              </Card>
            </Popover>



          </div>




          <Divider />
          <br />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Button icon="eraser" text="Reset" />
            <br />
            <Button onClick={add} icon="plus" text="Add" />
            <br />
            <Button onClick={save} icon="save" text="Save" />
            <br />
          </div>

        </Card>

        <Card style={{ marginLeft: "50px", width: "200px", backgroundColor: Colors.LIGHT_GRAY5 }}>
          {
            state.loadedRooms.map((room) => {
              return <Card style={{ marginTop: "10px", padding: "10px" }}>

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



    </div>
  );
}



export default App;
