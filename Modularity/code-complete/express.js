const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const router = require("./router");
app.use("/", router);

app.listen(port, () => console.log(`Express app listening on port ${port}!`));