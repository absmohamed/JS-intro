const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postRouter = require('./routes/posts_routes');

const port = 3000;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const dbConn = 'mongodb://localhost/posts'
// Set three properties to avoid deprecation warnings:
// useNewUrlParser: true
// useUnifiedTopology: true
// useFileAndModify: false
mongoose.connect(dbConn, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    },
    (err) => {
        if (err) {
            console.log('Error connecting to database', err);
        } else {
            console.log('Connected to database!');
        }
    });

app.get('/', (req, res) => {
    console.log("get on /");
    res.send("got your request");
})

app.use('/posts', postRouter);

app.listen(port, () => {
    console.log(`Blog express app listening on port ${port}`);
});