// Variable declaration and assignment
const country = "Australia" // constant variable and block scoped
var city = "Brisbane" // global scope
let state = "Queensland" // block scoped

// Printing to screen
console.log(country)
console.log(state)

// String Interpolation in Javascript
console.log(`I live in ${city} in the state of ${state}`);

// Data Structures in Javascript (JS Objects are simliar to Ruby Hashes)
// Objects in JS can even store functions.
  let australia = {
    population: "25.415 million",
    capitalCity: "ACT",
    numberOfTimesVisited: 1,
    // here, timesVisited() is a function which can be stored in an object.
    // australia is the object storing the function.
    timesVisited() {
      return this.numberOfTimesVisited ++;
    }
  }
  console.log(`I have visited Australia ${australia.timesVisited()} times`);
  console.log(`I have visited Australia ${australia.timesVisited()} times`);
  console.log(`I have visited Australia ${australia.timesVisited()} times`);