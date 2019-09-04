// All objects will have a constructor property. 
// Objects created without the explicit use of a constructor function 
// will have a constructor property that points to the 
// Fundamental Object constructor type for that object.

var o = {};
o.constructor === Object; // true

var o = new Object;
o.constructor === Object; // true

var a = [];
a.constructor === Array; // true

var a = new Array;
a.constructor === Array; // true

var n = new Number(3);
n.constructor === Number; // true