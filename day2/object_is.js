
// ****************************************** //
// Compares primitive date types by value.
console.log(Object.is('plastic', 'plastic'));     // true

console.log(Object.is('plastic', 'compost'));     // false

let num1 = 1;
let num2 = 1;

console.log(Object.is(num1,num2)); //true

// ****************************************** //
// Compares data structures like arrays and objects by reference.

console.log(Object.is([], []));           // false

var plasticbag = { "goestolandfill": "yes" };
var coffeecup = { "goestolandfill": "yes" };
console.log(Object.is(plasticbag,coffeecup)); //false

//Special cases

console.log(Object.is(null, null));       // true
console.log(Object.is(NaN, NaN));         // true