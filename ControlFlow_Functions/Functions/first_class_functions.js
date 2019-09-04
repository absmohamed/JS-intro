// Function definition and invocation
function speak(string) {
    console.log(string);
  }
  speak("Hello");                     // logs "Hello"
  
  // Store in a variable
  var talk = speak;
  talk("Hi");                         // logs "Hi"
  
  // Pass as an argument to a function
  // Return from a function
  function functionReturner(fn) {
    return fn;
  }
  var chat = functionReturner(talk);
  chat("Good Morning");               // logs "Good Morning"
  
  // Store in a data structure
  var myFuncs = [talk];
  myFuncs[0]("Good Afternoon");       // logs "Good Afternoon"