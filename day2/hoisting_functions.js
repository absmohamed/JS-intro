// This is an example of hoisting a function.
// The function f() is already stored in the memory before the 
// actual function call happens / execution takes place.
// This occurs when the .js file is first loaded and the interpreter runs for the first time
var i = "z";
var list = ["a","b","c"];
f();
function f()
{
    for (let i of list)
    {
        console.log(i);
    }
    console.log(i);
}
console.log(i);


// Expected output is a b c z z.

