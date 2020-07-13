import React, { useState } from 'react';
import { Card, Colors, Button, InputGroup, Divider, H1, Popover, H3, NonIdealState, Navbar } from "@blueprintjs/core"
import axios from "axios"
import { Route, Switch, BrowserRouter, Link } from "react-router-dom"
import Editor from "./Pages/editor"
import Generator from "./Pages/generator"
import RoomLayout from "./Pages/room-layout"

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

  return <div>
    <BrowserRouter >

      <Navbar>
        <Navbar.Group align="right">
          <Link to="/editor">Editor</Link>
          <Divider />
          <Link to="/generator">Generator</Link>
          <Divider/>
          <Link to="/">Room Layout</Link>
        </Navbar.Group>
       
      </Navbar>
      <Route path="/editor">
          <Editor />
        </Route>
        <Route path="/generator">
          <Generator />
        </Route>
        <Route  >
          <RoomLayout />
        </Route>
    </BrowserRouter>
  </div>
}

/*function App() {

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
      let furnitureData = res.data.props;
      let furnitureCategories = Object.keys(res.data.props);
      let currentCategory = furnitureCategories[0]
      grid.currentProp = res.data.props[0];
      setState(
        {
          ...state
          , ...{
            loading: false,
            furnitureData,
            currentCategory,
            furnitureCategories,
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
      props: state.furnitureData
    }).then((res) => {
      console.log(res)
    })
  }

  const add = (event) => {
    event.preventDefault();
    let formdata = new FormData(event.currentTarget);
    let name = formdata.get("name")
    var loadedRooms = state.loadedRooms;
    let gridData = state.grid.exportGrid();
    gridData.name = name;
    loadedRooms.push(gridData)
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
    state.furnitureData[state.currentCategory].push(furniturePreset)
    let length = state.furnitureData[state.currentCategory].length
    console.log(state.furnitureData)
    setState({
      ...state,
      furnitureData: state.furnitureData,
      currentProp: state.furnitureData[state.currentCategory][length - 1]
    })
  }

  const addFurnitureCategory = (event) => {
    event.preventDefault();
    var formData = new FormData(event.currentTarget);

    let category_name = formData.get("category_name");
    console.log(state.furnitureData, category_name)
    if (state.furnitureData[category_name] === undefined) {
      state.furnitureData[category_name] = [];
      setState({
        ...state, ...{
          furnitureData: state.furnitureData

        }

      })
    }


  }

  const PropDisplay = (item) => {

    return <Card
      className={
        state.currentProp.name === item.name ? "bp3-dark" : ""
      }
      onClick={() =>
        setState({ ...state, currentProp: item })

      }

      style={{ display: "flex", padding: "5px", marginBottom: "10px" }}>
      <Card style={{ backgroundColor: item.color, padding: "0px", width: "20px", height: "20px" }} />
      <div style={{ marginLeft: '10px' }}>
        {item.name}
      </div>
    </Card>
  }

  const PropCategoryDisplay = (item) => {

    return <Card
      className={
        state.currentCategory === item ? "bp3-dark" : ""
      }
      onClick={() => {
        setState({ ...state, currentCategory: item, currentProp: state.furnitureData[item][0] })
      }


      }

      style={{ display: "flex", padding: "5px", marginBottom: "10px" }}>

      <div style={{ marginLeft: '10px' }}>
        {item}
      </div>
    </Card>
  }

  const removeCategory = () => {
    state.furnitureData[state.currentCategory] = undefined;
    state.currentCategory = undefined;
    state.furnitureData = JSON.parse(JSON.stringify(state.furnitureData));
    setState({ ...state, furnitureData: state.furnitureData })
  }

  const removeProp = () => {

    let furniture = state.furnitureData[state.currentCategory];
    let index = furniture.findIndex((item) => {
      return item.name === state.currentProp.name
    })
    furniture.splice(index, 1);
    state.furnitureData[state.currentCategory] = furniture;
    setState({ ...state, furnitureData: state.furnitureData })
  }

  console.log(state.currentProp)
  return (
    <div style={{ margin: "100px" }}>
      <div style={{ display: "flex" }}>

        <Card
          style={{
            backgroundColor: Colors.LIGHT_GRAY5
          }}
        >








          <GridRenderer currentProp={state.currentProp} grid={state.grid} />
          <Divider />
          <form onSubmit = {add}>


            <div style={{ margin: "auto", display: "flex  " }}>

              <Button onClick={() => setRotation(state.rotation + 90)} icon="image-rotate-left" />
              <Button icon={rotationIndicators[state.rotation % 360]} />

              <Button onClick={() => setRotation(state.rotation - 90)} icon="image-rotate-right" />

              <div style={{ flexGrow: 1 }}>
                <InputGroup style={{ marginLeft: "10px", float: "right", width: "fit-content" }} placeHolder="Room name..." name="name" />
              </div>


            </div>
            <br/>
            <div style={{ margin: "auto", display: "flex  " }}>
              
              <Button icon="eraser" text="Reset" />

              <InputGroup value="Add Room" type = "submit" style = {{marginLeft: "20px"}} />

            </div>
          </form>
        </Card>

        <Card style={{ marginLeft: "50px", width: "200px", backgroundColor: Colors.LIGHT_GRAY5 }}>
          <form onSubmit={changeRoomSize} >

            <InputGroup name="width" placeholder="Room Width" defaultValue={state.grid.width}></InputGroup>
            <br />
            <InputGroup name="height" placeholder="Room Height" defaultValue={state.grid.height}></InputGroup>
            <br />

            <InputGroup intent="primary" type="submit" value="Change Room Name" />
          </form>

          <Divider />


          <Divider />
          <br />
          <div style={{ display: "flex", flexDirection: "column" }}>

            <Button onClick={save} icon="floppy-disk" text="Save All Data" />
            <br />
          </div>

        </Card>

        <Card style={{ marginLeft: "50px", width: "200px", backgroundColor: Colors.LIGHT_GRAY5 }}>

          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ flexGrow: 1 }}>
              {
                Object.keys(state.furnitureData).length > 0 ?
                  Object.keys(state.furnitureData).map((item) => {
                    return PropCategoryDisplay(item)
                  }) : <NonIdealState title="No categories" />
              }
            </div>


            <div>
              <Popover>
                <Button fill icon="plus" style={{ width: "100%" }} text="Add Category" >  </Button>

                <Card>
                  <form onSubmit={addFurnitureCategory}>
                    <InputGroup name="category_name" placeholder="Category Name..." />
                    <br />
                    <InputGroup type="submit" value="Save Category" />
                  </form>

                </Card>
              </Popover>

              <br />
              <Button fill icon="minus" text="Remove Category" onClick={removeCategory} >  </Button>
            </div>
          </div>


        </Card>

        <Card style={{ marginLeft: "50px", width: "200px", backgroundColor: Colors.LIGHT_GRAY5 }}>

          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ flexGrow: 1 }}>
              {

                state.furnitureData[state.currentCategory] === undefined ? <div /> :

                  state.furnitureData[state.currentCategory].map((item) => {
                    return PropDisplay(item)
                  })
              }
            </div>


            <div>
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

              <br />
              <Button fill icon="minus" text="Remove Prop" onClick={removeProp} >  </Button>
            </div>



          </div>



        </Card>

        <Card style={{ marginLeft: "50px", width: "400px", backgroundColor: Colors.LIGHT_GRAY5 }}>
          {
            state.loadedRooms.map((room) => {
              return <Card onClick={() => {

                state.grid.loadRoom(room)
                setState({ ...state, grid: state.grid })
              }} className="bp3-elevation-2 bp3-button" style={{ marginTop: "10px", padding: "10px", display : "flex" }}>

                <div>
                  Name : {room.name}
                </div>
                <Divider/>
                <div>
                  Width : {room.width}
                </div>
                <Divider/>
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
}*/



export default App;
