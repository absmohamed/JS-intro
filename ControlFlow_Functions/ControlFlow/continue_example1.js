var i = 0;
var n = 0;
while (i < 5) {
  i++;
  if (i === 3) {
    continue;
    //takes the control to the innermost while loop while (i < 5) to continue looping
  }
  n += i;
  console.log(n);
}
//1,3,7,12


var i = 0; 
var n = 0; 
while (i < 5) { 
  i++; 
  if (i === 3) { 
     // continue; // try it without continue statement!
  } 
  n += i; 
  console.log(n);
}
// 1,3,6,10,15