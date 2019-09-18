- [Fetch API for making network requests](#fetch-api-for-making-network-requests)
- [Getting a response with the fetch() method.](#getting-a-response-with-the-fetch-method)
  - [First:](#first)
  - [Second:](#second)
- [Challenge](#challenge)


## Fetch API for making network requests
We all know now that javascript can be used to make requests over the network to a server and load new information and reload specific parts of the webpage.
Thanks to the "AJAX" way of doing things.
One of the multiple ways to send a network request and get information from the server is by using the `Fetch API` which uses the `fetch()` method.
The Fetch API provides a JavaScript interface for accessing and manipulating parts of the HTTP pipeline, such as requests and responses. It also provides a global fetch() method that provides an easy, logical way to fetch resources asynchronously across the network

The basic syntax for using the Fetch API is :
```javascript
    let promise = fetch(url, [options]);
```
## Getting a response with the fetch() method.
The browser starts the request right away and returns a promise that the calling code should use to get the result.

Getting a response is usually a two-stage process.

### First:

The fetch() returns a promise that can be resolved with the response object.
At this stage we can check HTTP status, to see whether it is successful or not

The promise rejects if the fetch was unable to make HTTP-request, e.g. network problems, or there’s no such site. Abnormal HTTP-statuses, such as 404 or 500 do not cause an error.

We can see HTTP-status in response properties:
    status – HTTP status code, e.g. 200.
    ok – boolean, true if the HTTP status code is 200-299.

### Second:

To get the response body, we need to use an additional method call.
Response provides multiple promise-based methods to access the body in various formats:

    1. response.text() – read the response and return as text,
    2. response.json() – parse the response as JSON,
    3. response.formData() – return the response as FormData object,
    4. response.blob() – return the response as Blob (binary data with type),
    5. response.arrayBuffer() – return the response as ArrayBuffer (low-level representaion of binary data)

It is interesting however to note that only one method can be used with the response object as using the second method will throw an error since we already have the response body processed with the first method.

We will now look at an example of how we can use fetch() to get a JSON object from a .json file.

## Challenge
The challenge for this lesson is in the challenge folder. Have fun!