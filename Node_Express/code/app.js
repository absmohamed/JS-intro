const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

// When we create an http server, we pass it a callback function that performs the actions of the server
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

// What is the third argument to the listen method on http server? When do you think it is called?
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});