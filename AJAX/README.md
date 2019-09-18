# Agenda and resources

- [Agenda and resources](#agenda-and-resources)
  - [Intro To AJAX](#intro-to-ajax)
  - [How AJAX works](#how-ajax-works)
  - [XMLHttpRequest Object](#xmlhttprequest-object)
  - [References](#references)

## Intro To AJAX
AJAX stands for Asynchronous Javascript and XML and Asynchronous refers to a bunch of events that happen in irregular time intervals.
Basically AJAX enables reloading parts of a webpage rather than reloading the entire web page.
Some interesting facts about AJAX: 
1. By combining JavaScript, CSS, and XML, AJAX allows reloading only specific elements of the page instead of the entire page.
2. AJAX is applied to create fast, dynamic, and modern websites, such as Google, Facebook, YouTube or Twitter.
3. AJAX is not dependent on what browser it's running on.
4. AJAX can send and receive information in various formats like JSON, XML, HTML and text files.

## How AJAX works
AJAX is not a programming language.

AJAX just uses a combination of:

A browser built-in XMLHttpRequest object (to request data from a web server)
JavaScript and HTML DOM (to display or use the data)

![How AJAX works](img/ajax.gif)

1. An event occurs in a web page (the page is loaded, a button is clicked)
2. An XMLHttpRequest object is created by JavaScript
3. The XMLHttpRequest object sends a request to a web server
4. The server processes the request
5. The server sends a response back to the web page
6. The response is read by JavaScript
7. Proper action (like page update) is performed by JavaScript

What AJAX allows us to do is to prevent the default behaviour of reloading an entire page when we receive a response from a server, and only update the relevant parts of the page. We do this by using an XMLHttpRequest object to send the request to the server and receive the response, then use JS and DOM manipulation to alter the parts of the page affected.

## XMLHttpRequest Object
1. We create an XMLHttpRequest (XHR) Object like this : 
```javascript
    let request = new XMLHttpRequest();
```
2. We open the request with the http method and the URL. By default, the request is asyncronous and this can be overwritten. The username and password can also be specified (considering a scenario where we are trying to access an external server that requires authentication).
```javascript
    // Here, open does not open the connection but it configures the request.
    // Actual call happens when we call the send() method.
    request.open('GET','json_example.json');
```
This method is usually called right after new XMLHttpRequest. It specifies the main parameters of the request:

    xhr.open(method, URL, [async, user, password])

    1. method – HTTP-method. Usually "GET" or "POST".
    2. URL – the URL to request, a string, can be URL object.
    3. async – if explicitly set to false, then the request is synchronous, we’ll cover that a bit later.
    4. user, password – login and password for basic HTTP auth (if required).
    5. Please note that open call, contrary to its name, does not open the connection. It only      configures the request, but the network activity only starts with the call of send.

3. We define a callback function that will execute when the request is completed.
```javascript
    request.onload = function () {
    let savePlanetEarth = JSON.parse(this.response);
    populateHeader(savePlanetEarth);
    showMembers(savePlanetEarth);
};
```
4. Now the request actually needs to be sent.
```javascript
    request.send();
```


## References
[AJAX Intro](https://www.w3schools.com/xml/ajax_intro.asp)
