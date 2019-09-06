# Agenda

* [Code samples and challenges](#code-samples-and-challenges)

## JSON Intro

JSON exists as a string — useful when data needs to be transmitted across a network. However, it needs to be converted to a native JavaScript object when the data needs to be  accessed.`JSON` is a global object that has the methods to convert string to object `parse()` and method to convert the object to string `stringify()`.

## Using JSON objects
JSON Objects can be stored in memory in a variable and declared using `let`, `var` or `const` in a .js file. This syntax is exactly the same as it is for defining any JS object.

```javascript
let jsonObject = { 
    firstName: "Steve",
    lastName: "Irwin",
    pets: ["kangaroo","crocodile","koala"]
}
// To convert this JSON object into a string, we use the stringify() method
let jsonObjToStr = JSON.stringify(jsonObject);
console.log(jsonObjToStr);
console.log(typeof jsonObjToStr);

// To convert the string to a JSON Object, we use the parse() method
let  jsonObjNew = JSON.stringify(jsonObjToStr);
console.log(jsonObjNew);
console.log(typeof jsonObjNew);

```
Please refer to an example in the **code** directory - (json_example.html and json_example.js).
This example uses DOM manipulation to populate a HTML page with data from a JSON object.

## Storing JSON objects
JSON Objects can also be stored in a file. This is one way to persist data.
This is appropriate for persisitng data on a server.
JSON file is a text file with a .json extension and it stores the JSON object.

Please refer to an example json file in the **code** directory. (json_example.json)

### Read a JSON object from a file

The `require()` method is used to load .json files and js modules. 
When called with a .json file, the require() method will read and parse the JSON object and return the JSON object.
Please refer to an example json file in the **code** directory. (json_with_require.js)
In the example we have the `require()` method parsing a JSON object followed by methods to access specific pieces of information from that JSON object. 

## Code samples and challenges
Code samples can be found in the **code** directory.

Try the challenges in the **challenge** directory.

