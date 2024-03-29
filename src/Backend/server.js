const express = require('express');
var bodyParser = require('body-parser')
const cors = require('cors');
const fs = require(
    "fs"
)
const proxy = require("http-proxy-middleware");
const path = require('path');

/* Init express */
const port = 3001;
const address = process.env.SERVER_ADDRESS || "localhost";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));
//app.use(proxy(["/api/"], {target : "http://localhost:3001"}))

app.get("/api/load", function (req, res) {
    var rooms = JSON.parse(fs.readFileSync(__dirname + "/Data/data.json", "utf8"));
    var props = JSON.parse(fs.readFileSync(__dirname + "/Data/props.json", "utf8"));
    res.send({rooms, props});
})
app.post("/api/save", function (req, res) {
    fs.writeFileSync(__dirname + "/Data/data.json", JSON.stringify(req.body.rooms));
    fs.writeFileSync(__dirname + "/Data/props.json", JSON.stringify(req.body.props))
    res.send(200);
})

app.listen(port, address, () => console.log(`Server running on http://${address}:${port}`));

app.address = address + ":" + port

module.exports = app;