const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  console.log(req)
  res.end()
});


// When we create an http server, we pass it a callback function that performs the actions of the server
const server = http.createServer(serverResponses);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
});