// The Array.from() method creates a new, shallow-copied Array instance 
// from an array-like or iterable object.
console.log(Array.from('javascript'));
// expected output: Array [ 'j', 'a', 'v', 'a', 's', 'c', 'r', 'i', 'p', 't' ]

console.log(Array.from([1, 2, 3], x => x + x));
// expected output: Array [2, 4, 6]

// In the above examples, the 'javascript' and [1,2,3] are the array-like iteratable objects.


// *******************************************************************************************
// More Array.from examples
// Array from a StringSection
Array.from('ruby'); 
// [ "r", "u", "b", "y" ]

// Array from a SetSection
const set = new Set(['foo', 'bar', 'baz', 'foo']);
Array.from(set);
// [ "foo", "bar", "baz" ]

// Array from a MapSection
const map = new Map([[1, 2], [2, 4], [4, 8]]);
Array.from(map);
// [[1, 2], [2, 4], [4, 8]]

const mapper = new Map([['1', 'a'], ['2', 'b']]);
Array.from(mapper.values());
// ['a', 'b'];

Array.from(mapper.keys());
// ['1', '2'];

// Array from an Array-like object (arguments)Section
function f() {
  return Array.from(arguments);
}

f(1, 2, 3);

// [ 1, 2, 3 ]

// Using arrow functions and Array.from()
// Using an arrow function as the map function to manipulate the elements
Array.from([1, 2, 3], x => x + x);      
// [2, 4, 6]

// Generate a sequence of numbers
// Since the array is initialized with `undefined` on each position,
// the value of `v` below will be `undefined`
Array.from({length: 5}, (v, i) => i);
// [0, 1, 2, 3, 4]