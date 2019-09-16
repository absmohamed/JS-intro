// Using promises

// Returns a promise
function getJoke() {
  return new Promise(function (resolve, reject) {
    $.getJSON("https://icanhazdadjoke.com/", (dadJoke) => {
      if (dadJoke) resolve(dadJoke.joke);
      else reject("Error getting joke");
    });
  });
}

function compileJokes(num, callback) {
  let jokes = [];
  for (let i = 0; i <= num; i++) {
    getJoke()
      .then((dadJoke) => {
        jokes.push(dadJoke);
        if (i == 5) callback(jokes);
      });
  }
}

function logAndDisplayJokes(jokes) {

  let jokesDiv = document.createElement("div");
  let body = document.querySelector("body");
  body.appendChild(jokesDiv);
  for (let joke of jokes) {
    let jokePara = document.createElement("p");
    jokePara.innerText = joke;
    jokesDiv.appendChild(jokePara);
  }
  console.log(jokes);
}

document.querySelector("#button").addEventListener("click", () => {
  compileJokes(5, logAndDisplayJokes);
});