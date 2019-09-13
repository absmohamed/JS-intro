const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

// Initialise our array of students with some names
let students = ['Carlie', 'Tony', 'Sam', 'Carl', 'Sherine', 'Lelani', 'Aidan', 'Jack', 'Mark', 'Rachel'];

// A simple function to return two random students as a string
// It is possible we'll get the same student twice
function randomPair() {
  let s1Ind = Math.floor(Math.random() * students.length);
  let s2Ind = Math.floor(Math.random() * students.length);
  return `${students[s1Ind]} ${students[s2Ind]}`;
}

// Callback function that will handle all of our server functions
const serverResponse = (req, res) => {

  // Get the http method, url, and headers from the request
  const {
    method,
    url,
    headers
  } = req;


  // handle the GET requests
  if (method === 'GET') {
    switch (url) {
      case '/':
        console.log('matching students');
        res.setHeader('Content-Type', 'text/plain');
        res.end(randomPair());
        break;
      case '/students':
        console.log('getting students');
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(students));
        break;
      default:
        console.log('invalid route');
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Invalid route');
    }
  }

  // Handle the post request
  if (method === 'POST' && url === '/students') {
    console.log('received a POST request');
    res.setHeader('Content-Type', 'application/json');
  }

  // Handle getting data from the client request (on POST)
  let data = []; // Used to collect chunks of data
  req.on('data', chunk => {
    // This event fires when we receive data in the request. The data comes in chunks
    console.log(`Data chunk available: ${chunk}`);
    // We need to parse the chunk, or we will store it as a stream object
    data.push(JSON.parse(chunk));
    // See what it looks like when we store it as a stream object in our array of data
    // data.push(chunk);
  });
  req.on('end', () => {
    // The end event signifies the end of the request, and therfore the end of the data stream 
    // We'll store any data we got from a post in our array, then send our response to the client
    // If we got data (for a post), add it to our array of students
    // In this case, we only expect to get a single chunk of data - just a student name to add to our array of students
    if (data.length > 0) {
      console.log('retrieved data', data[0]);
      students.push(data[0].name);
    }
    // Send the updated list of students in the response
    res.end(JSON.stringify(students));
  });
}

// When we create an http server, we will pass it a callback function that the routes for the server
const server = http.createServer(serverResponse);

// What is the third argument to the listen method on http server? When do you think it is called?
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});