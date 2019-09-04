// Create the HTTP module
// This allows Node.js to transfer data over the Hyper Text Transfer Protocol (HTTP).
const http = require("http");
const hostname = "localhost"; 
const port = 8000;

// createServer method turns the computer into a HTTP server
// The http.createServer() method creates an HTTP Server object.
// The HTTP Server object can listen to ports on your computer and execute a function, 
// a requestListener, each time a request is made.
const server = http.createServer((req, res) => {

// Set the response HTTP header with HTTP status and Content type
// The HTTP 200 OK success status response code indicates that the request has succeeded.
res.writeHead(200, {'Content-Type': 'text/plain'});
    
// Send the response body "Hello World"
res.end('Hello World using Node.js\n');
});

// Prints a log once the server starts listening
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
 })

 // Here is how Node.js handles a file request:

// Sends the task to the computer's file system.
// Ready to handle the next request.
// When the file system has opened and read the file,
// the server returns the content to the client.
// Node.js eliminates the waiting, and simply continues with the next request.

// Node.js runs single-threaded, non-blocking, asynchronously programming,
// which is very memory efficient.
