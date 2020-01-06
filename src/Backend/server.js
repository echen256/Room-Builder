const express = require('express');
var bodyParser = require('body-parser')
const cors = require('cors');
const fs = require(
    "fs"
)

/* Init express */
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())
console.log(__dirname)
app.get("/load", function (req, res) {
    var file = fs.readFileSync(__dirname + "/Data/data.json", "utf8");
    res.send(file);
})


app.post("/save", function (req, res) {
    var data = (JSON.stringify(req.body.rooms));
    fs.writeFileSync(__dirname + "/Data/data.json", data)
    res.send(200);
})

const port = parseInt(process.env.PORT) + 1 || 3001;
const address = process.env.SERVER_ADDRESS || "localhost";

app.listen(port, address, () => console.log(`Server running on http://${address}:${port}`));


module.exports = app;