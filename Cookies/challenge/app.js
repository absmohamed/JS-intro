const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

const secret = 'CoderAcademy is the bomb';
const cookieKey = 'secretKey';

app.use(bodyParser.json());
app.use(cookieParser(secret));
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
}));
session.timesTried = 0;

app.get('/', (req, res) => {
    let clientCookies = req.cookies;
    let cookieValue = clientCookies[cookieKey];
    let message = `<p>What is the server doing? Send the server a cookie with the key "secretKey" and one word that describes what the server is doing. Guess the first time. You will figure it out by examining the cookie value each time it comes back from the server.</p><p>After the 5 attempt, you can try to look at the code to figure it out, and see if you can solve it.</p>`;
    if (session.timesTried > 0 && (clientCookies == null || !cookieValue || cookieValue.length === 0)) {
        message = 'You need to send a cookie with the key "secretKey", and a single word value that you think solves the riddle.'
    }
    if (cookieValue.match(/echo.*/) || cookieValue.match(/repeat.*/)) {
        message = `Congratulations! You figured it out. Way to go! It took you ${session.timesTried} attempts.`;
        session.timesTried = 0;
    } else if (session.timesTried > 4) {
        message = 'You have tried 5 times! Have a look at the code and see if you can figure out what to send.';
        session.timesTried = 0;
    } else if (cookieValue) {
        res.cookie(cookieKey, `${cookieValue}${cookieValue}`);
        res.setHeader("Content-type", "text/html");
    }
    console.log("times tried:", session.timesTried)
    session.timesTried++;
    res.send(message);
})

app.get('/clearCookie', (req, res) => {
    console.log("In clearCookie got cookies:", req.cookies);
    console.log("got query string", req.query);

    let cookieName = req.query["name"];
    res.clearCookie(cookieName);
    res.send(`Cleared cookie: ${cookieName}`);
});

app.listen(3000, () => {
    console.log('Server running on port 3000! Send me a cookie!');
})