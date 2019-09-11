# Agenda

- [Agenda](#agenda)
  - [JSON Intro](#json-intro)
  - [Using JSON objects](#using-json-objects)
  - [Storing JSON objects](#storing-json-objects)
    - [Read a JSON object from a file](#read-a-json-object-from-a-file)
    - [Writing to a file with the fs module](#writing-to-a-file-with-the-fs-module)
  - [Code samples](#code-samples)
  - [Challenges](#challenges)
    - [Bonus Challenge](#bonus-challenge)

## JSON Intro

JSON exists as a string — useful when data needs to be transmitted across a network. However, it needs to be converted to a native JavaScript object when the data needs to be accessed.`JSON` is a global object that has the methods to convert string to object `parse()` and method to convert the object to string `stringify()`.

## Using JSON objects

JSON Objects can be stored in memory in a variable and declared using `let`, `var` or `const` in a .js file. This syntax is exactly the same as it is for defining any JS object.

```javascript
let jsonObject = {
	firstName: "Steve",
	lastName: "Irwin",
	pets: ["kangaroo", "crocodile", "koala"]
}
// To convert this JSON object into a string, we use the stringify() method
let jsonObjToStr = JSON.stringify(jsonObject)
console.log(jsonObjToStr)
console.log(typeof jsonObjToStr)

// To convert the string to a JSON Object, we use the parse() method
let jsonObjNew = JSON.parse(jsonObjToStr)
console.log(jsonObjNew)
console.log(typeof jsonObjNew)
```

Please refer to an example in the **code** directory - (json_example.html and json_example.js).
This example uses DOM manipulation to populate a HTML page with data from a JSON object.

## Storing JSON objects

JSON Objects can also be stored in a file. This is one way to persist data. This is appropriate for persisitng data on a server. In general, we don't persist data on a client, expect to cache it temporarily. We'll talk more about that later in the course.

JSON file is a text file with a .json extension and it stores the JSON object.

Please refer to an example json file in the **code** directory. (json_example.json)

### Read a JSON object from a file

The `require()` method is used to load .json files and js modules. When called with a .json file, the require() method will read and parse the JSON object and return the JSON object.

```javascript
const jsonObj = require("json_example.json")
```

Please refer to an example json file in the **code** directory. (json_with_require.js)

In the example we have the `require()` method parsing a JSON object followed by methods to access specific pieces of information from that JSON object. This is really just like implementing any functions to access and modify an object. Let's implement the methods one at a time, then store the updated object back to the file.

### Writing to a file with the fs module

The 'fs' module provides a way to read and write files. To use it, we just need to require it:

```javascript
const fs = require("fs")
```

We can use the `writeFile` method if what we want to do is overwrite a file's contents (which is what we want in this case). The `writeFile` method is [documented here](https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback). It takes three parameters:

- filename
- data (must be a string - will be coerced to a string)
- callback function

The callback function can be used to handle errors, or print a message when the write succeeds (or do any post-processing).

What JSON method can we use to pass a string representation of our modified object to writeFile?

## Code samples

Code samples can be found in the **code** directory.

## Challenges

1. Using the .csv file in the **challenge** directory, organise the data in a _simpsons.json_ file as follows for the first season of the show:

- Seasons
  - Season
    - Number
    - Year
    - Episodes
      - Episode
        - title
        - air date
        - number in season
        - number in series
        - Image url
        - IMDB
          - rating
          - votes

2. Write a JavaScript console app that reads and parses the simpsons.json file, and logs the following information:

```
IMDB Ratings for Simpsons Season 1 (released 1990):

Simpsons Roasting on an Open Fire - 8.2
Bart the Genius - 7.8
Homer 's Odyssey - 7.5
There 's No Disgrace Like Home - 7.8
Bart the General - 8.1
Moaning Lisa - 7.6
The Call of the Simpsons - 7.9
The Telltale Head - 7.7
Life on the Fast Lane - 7.4
Homer 's Night Out - 7.8
The Crepes of Wrath - 8.3
Krusty Gets Busted - 7.9
Some Enchanted Evening - 7.9

Average rating for episodes in season 1 was: 7.84
```

### Bonus Challenge

Store the .json in a variable in a script, and display information on a webpage in a browser.

Use the image information to show the image for each episode.

Get creative and display interesting information in a pleasing way.
