// Example 1: (Slide 9 of Day 2)
// When a variable i is declared as var (scope is global)
// Inside the for loop in the function, i is declared as let (scope is local)
var i = "z";
var list = ["a","b","c"];

function f()
{
    for (let i of list)
    {
        console.log(i);
    }
    console.log(i);
}
console.log(i);
f(); // Expected output is z a b c z

// Example 2: (Slide 10 of Day 2)
// When a variable i is declared as a var (global scope)
// Inside the function for loop, i is not declared as let
// therefore making its scope as global 
var i = "z";
var list = ["a","b","c"];

function f()
{
    for (i of list)  
    // Not specifiying the declaration as "let" in the for loop above
    // implies that the declaration of i is global!
    // this can lead to a situation where the variable gets changed and
    // hence loses its original value which is undesirable
    {
        console.log(i);
    }
    console.log(i);
}
console.log(i);
f(); // Expected output is z a b c c 


