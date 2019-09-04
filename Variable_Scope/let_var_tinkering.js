// ******************************************************************
var i = "z";
let list = ["a","b","c"]; 
//Hint: list is global as scope of execution is the entire code. 
f();
function f()
{
    let list = ["d","e","f"]; //Hint: list is global within the function
    for (var i of list)
    {
        console.log(i);
    }
    console.log(i);
}
console.log(i);

// Expected output : d e f f z 
// Discuss why.

// ******************************************************************
function varTest() {
    var x = 1;
    if (true) {
      var x = 2; 
      console.log(x); 
    }
    console.log(x);
  }
  
  varTest();

  // Expected output : 2 2
  // Discuss why.

  // ******************************************************************
