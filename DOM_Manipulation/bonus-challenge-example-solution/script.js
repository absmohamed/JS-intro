let challenges = {}

function addChallenge(event) {
  event.preventDefault();
  let form = document.getElementById("challenge-form");
  let challengeName = form.elements[0].value;
  challenges[challengeName] = false;
  showChallenges();
}

function showChallenges() {
  let challengeList = document.getElementById("challenge-list");
  let challengesDiv = challengeList.querySelector("div");
  challengesDiv.remove();
  challengesDiv = document.createElement("div");
  challengesDiv.classList.add("tile");
  challengesDiv.classList.add("is-ancestor");
  challengeList.appendChild(challengesDiv);
  for (let challenge in challenges) {

    let challengeTile = document.createElement("div");
    challengeTile.classList.add("tile");
    challengeTile.classList.add("is-parent");
    let article = document.createElement("article");
    article.classList.add("tile");
    article.classList.add("is-child");
    article.classList.add("notification");
    article.classList.add("is-info");
    let para = document.createElement("p");

    para.innerText = challenge;
    article.appendChild(para);
    challengeTile.appendChild(article);
    challengesDiv.appendChild(challengeTile);
  }
}

let challengeForm = document.getElementById("challenge-form");
challengeForm.addEventListener("submit", addChallenge);
showChallenges();