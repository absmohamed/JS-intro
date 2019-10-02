const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const postRouter = require('./routes/posts_routes');
const authRouter = require('./routes/auth_routes');

const port = 3000;

const app = express();

// Install middleware
app.use(cors());
app.use(bodyParser.json());
app.use(session({
    // resave and saveUninitialized set to false for deprecation warnings
    secret: "Express is awesome",
    resave: false,
    saveUninitialized: false
}));

require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

const dbConn = 'mongodb://localhost/blog_app'
// Set three properties to avoid deprecation warnings:
// useNewUrlParser: true
// useUnifiedTopology: true
// useFileAndModify: false
// useCreateIndex: true
mongoose.connect(dbConn, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    },
    (err) => {
        if (err) {
            console.log('Error connecting to database', err);
        } else {
            console.log('Connected to database!');
        }
    });

app.get('/', (req, res) => {
    console.log('get on /');
    console.log('req.session', req.session)
    res.send('got your request');
})

app.use('/posts', postRouter);
app.use('/auth', authRouter);

app.listen(port, () => {
    console.log(`Blog express app listening on port ${port}`);
});