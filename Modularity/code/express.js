const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const router = require('./router');

const app = express();
const port = 3000;

// use cors if we want to play with a client
app.use(cors());

// parse application/json
app.use(bodyParser.json());

// route handling
app.use('/', router);


app.listen(port, () => console.log(`Example app listening on port ${port}!`));

