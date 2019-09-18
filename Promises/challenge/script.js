const randomsUrl = 'https://randomuser.me/api/?results=10';

function getData() {
  return new Promise(function (resolve, reject) {
    $.getJSON(randomsUrl, (response) => {
      if (response) resolve(response.results) 
      else reject("Error getting results");
    });
  });
}

getData().then(users => {
  for(let user of users) {
  console.log(`Name: ${user.name.title} ${user.name.first} ${user.name.last}`);
  console.log("Email: ", user.email);
  console.log("Age: ", user.dob.age);
  }
}).catch(err => {
  console.log(err);
});
