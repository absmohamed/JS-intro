function x() {
    y = 1; // Throws a ReferenceError in strict mode.
    var z = 2;
  }
  
  x();
  
  console.log(y); // 1
  console.log(z); // Throws a ReferenceError: z is not defined outside x.

    // console.log(a);                // "undefined" or "" depending on browser
    // console.log('still going...'); // still going...
    // var a = 1;
    // console.log(a);                // 1
    // console.log('still going...'); // still going...
