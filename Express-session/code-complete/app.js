const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const postRouter = require('./routes/posts_routes');

const port = 3000;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const dbConn = 'mongodb://localhost/blog_app'
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

app.use(session({
    // resave and saveUninitialized set to false for deprecation warnings
    secret: "Express is awesome",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));

app.get('/', (req, res) => {
    console.log("get on /");
    req.session.timesVisited ?
        req.session.timesVisited++ : req.session.timesVisited = 1;
    res.send(`You have visited ${req.session.timesVisited} times!`);
})

app.use('/posts', postRouter);

app.listen(port, () => {
    console.log(`Blog express app listening on port ${port}`);
});