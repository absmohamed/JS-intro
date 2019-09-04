// Try this example !
// i is a variable which is declared with global scope as well as 
// a variable inside a function in a for loop.
// Execute the code below to observe the scope definition for i.

var i = "z";
var list = ["a","b","c"];
f(); // This is also an example for hoisting of functions.
function f()
{
    for (var i of list)
    {
        console.log(i);
    }
    console.log(i);
}
console.log(i);

// What is the expected output and why?
// Expected output is : a b c c z
// Reason: The variable i inside the function f() has been declared specifically as a var 
// therefore explicitly limiting its scope to the function f() and retaining the
// original value of i as "z" outside the function f()
// This also indicates that both variables are pointing to 2 different memory locations.

// **************************************************************************************
// TRY IT!
// In the above example change the for loop variable var i to let i and see the output