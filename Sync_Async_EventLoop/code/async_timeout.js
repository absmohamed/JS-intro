// What do you think will happen?

console.log(1);

setTimeout(() => {
  console.log(2);
}, 5000);

console.log(3);

// What about now, with a 0 millisecond timeout?
// console.log(1);

// setTimeout(() => {
//   console.log(2);
// }, 0);

// console.log(3);