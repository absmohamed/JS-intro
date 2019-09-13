const randomsUrl = 'https://randomuser.me/api/?results=10';

$.getJSON(randomsUrl, (response) => {
  if (response) {
    console.log(response.results);
  } else console.log("Error getting response");
});
