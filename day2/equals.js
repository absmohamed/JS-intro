var num = 0;
var obj = new String('0');
var str = '0';

console.log(num === num); // true
console.log(obj === obj); // true
console.log(str === str); // true

console.log("Compare num with obj using === first and then using ==");
console.log(num === obj); // false
console.log(num == obj); //true

console.log("Compare num with str using === first and then using ==");
console.log(num === str); //false
console.log(num == str); // true

console.log("Compare obj with str using === first and then using ==");
console.log(obj === str); // false
console.log(obj == str); //true

console.log("Compare null with undefined using === first and then using ==");
console.log(null === undefined); // false
console.log(null == undefined); // true

console.log("Compare null with NaN using === first and then using ==");
console.log(undefined === NaN); // false
console.log(undefined == NaN); // true

