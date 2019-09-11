const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;
let students = [];
const serverRoutes = (req, res) => {
  if (req.method === "GET")
    switch (req.url) {
      case "/":
        console.log("matching students");
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Student matcher');
        break;
      case "/students":
        console.log("getting students");
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(students));
        break;
      default:
        console.log("invalid route");
        res.statusCode = 404;
        res.end('Invalid route');
    }
  if (req.method === "POST" && req.url === "/students") {
    console.log("request is: ", req);
  }
}

// When we create an http server, we pass it a callback function that performs the actions of the server
const server = http.createServer(serverRoutes);

// What is the third argument to the listen method on http server? When do you think it is called?
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});