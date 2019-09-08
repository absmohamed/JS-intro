// Waiting for synchronous code

function wait(ms) {
  let start = Date.now(),
    now = start;
  while (now - start < ms) {
    now = Date.now();
  }
}
console.log("let's wait for 5 seconds ...");

wait(5000);

console.log("finished"); // Waiting - synchronous code