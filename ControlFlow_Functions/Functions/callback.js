function greeting(name) {
    alert('Hello ' + name);
  }

function goodBye(name) {
  alert('Goodbye ' + name);
}
  
function processUserInput(callback_function) {
    var name = prompt('Please enter your name.');
    callback_function(name);
  }
  
  processUserInput(greeting);
  processUserInput(goodBye);