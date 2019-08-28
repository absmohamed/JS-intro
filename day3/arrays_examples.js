// Please use these code pieces individually and try them out.
// ***************************************************************
// Create an Array
var fruits = ['Apple', 'Banana'];
console.log(fruits.length); // 2

// ***************************************************************
// Access (index into) an Array item
var first = fruits[0]; // Apple
var last = fruits[fruits.length - 1];// Banana

// ***************************************************************
//Loop over an Array
fruits.forEach(function(item, index, array) {
  console.log(item, index, array);
});
// Apple 0 [ 'Apple', 'Banana' ]
// Banana 1 [ 'Apple', 'Banana' ]

// ***************************************************************
//Add to the end of an Array
var newLength = fruits.push('Orange');
// ["Apple", "Banana", "Orange"]

// ***************************************************************
// Remove from the end of an Array
var last = fruits.pop(); // remove Orange (from the end)
// ["Apple", "Banana"];

// ***************************************************************
//Remove from the front of an Array
var first = fruits.shift(); // remove Apple from the front
// ["Banana"];

// ***************************************************************
// Add to the front of an Array
var newLength = fruits.unshift('Strawberry') // add to the front
// ["Strawberry", "Banana"];

// ***************************************************************
// Find the index of an item in the Array
fruits.push('Mango');
// ["Strawberry", "Banana", "Mango"]
var pos = fruits.indexOf('Banana');// 1

// ***************************************************************
// Remove an item by index position
var removedItem = fruits.splice(pos, 1); // this is how to remove an item
// ["Strawberry", "Mango"]

// ***************************************************************
// Remove items from an index position
let vegetables = ['Cabbage', 'Turnip', 'Radish', 'Carrot'];
console.log(vegetables); 
// ["Cabbage", "Turnip", "Radish", "Carrot"]
let pos = 1, n = 2;
let removedItems = vegetables.splice(pos, n); 
// this is how to remove items, n defines the number of items to be removed,
// from that position(pos) onward to the end of array.

console.log(vegetables); 
// ["Cabbage", "Carrot"] (the original array is changed)

console.log(removedItems); 
// ["Turnip", "Radish"]

// ***************************************************************
// Copy an Array
let arrayCopy = fruits.slice(); // this is how to make a copy
// ["Strawberry", "Mango"]

// ****************************************************************
// find and findIndex to get the first element in an array where a given expression is true.
let myFavoriteFruit = [ 'Apple', 'Orange', 'Lemon', 'Watermelon', 'Banana' ]
let item = myFavoriteFruit.find(x => x.length == 6 )   // Orange
let index = myFavoriteFruit.findIndex( x => x.length == 6 )   // 1

// ****************************************************************
// Mapping in arrays
let nums = [ 2, 3, 4 ]
let squares = nums.map( x => x ** 2 )   // [ 4, 9, 16 ]

// *****************************************************************
// filter an array
let numbers = [ 5, 2, 8, 7, 12 ]
let oddNumbers = numbers.filter( x => x % 2 == 1 )  // [ 5, 7 ]

// FIND gets us just ONE element(the first element) if that element is found.
// FIND returns "undefined" that element is not found and 
// FINDINDEX returns a -1 if that index is not found
// FILTER is like a FIND ALL where it returns an ARRAY or an empty ARRAY [] if nothing is found.


