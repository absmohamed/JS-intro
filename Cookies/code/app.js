const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

const port = 3000;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser("Coding is fun"));

app.get('/', (req, res) => {

    // Log cookies received on server (unsigned)
    console.log("Cookies:", req.cookies);
    let cookies = req.cookies;
    let cookieNames = Object.keys(cookies);
    console.log("Cookie names:", cookieNames);

    console.log("Signed cookies:", req.signedCookies);
    let signedCookieNames = Object.keys(req.signedCookies);
    console.log("Signed cookie names:", signedCookieNames);
  

    // Send a cookie from the server if we haven't
    if (!cookieNames.includes("serverCookie")) {
        res.cookie("serverCookie", "chocolate", {
            signed: true
        });
    }
  
    // Send cookie names back to client
    res.setHeader("Content-type", "text/html");
    if (cookieNames.length > 0) res.send(`On server have cookies for: ${cookieNames}`);
    else res.send("Got no cookies!");
  
})

app.get('/clearCookie', (req, res) => {
    console.log("In clearCookie got cookies:", req.cookies);
    console.log("got query string", req.query);
  
    let cookieName = req.query["name"];
    res.clearCookie(cookieName);
    res.send(`Cleared cookie: ${cookieName}`);
  });

app.listen(port, () => console.log(`Listening on port ${port}`));

