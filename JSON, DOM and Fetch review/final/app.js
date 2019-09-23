//variable of the url to get the 12 random employees
const url = "https://randomuser.me/api/?results=12";
const gallery = document.getElementById('gallery');
const button = document.querySelector('.button');

//asynchronous functions to get the JSON document from the url
function getJSON(){
    fetch(url).then(response => response.json())
        .then(data => showUsers(data))
        .catch( e => {
            gallery.innerHTML = "<h3>OOOOPS... Something went wrong!</h3>";
            console.error(e);
        });
}

getJSON();
//Function to display the data in the browser
function showUsers(data) {
    data.results.forEach((user, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        const fullName = document.createElement('p');
        fullName.textContent= user.name.first + " " + user.name.last;
        const email = document.createElement('p');
        email.textContent= user.email;
        const profPic = document.createElement('img'); 
        profPic.setAttribute('src', user.picture.medium);
        card.appendChild(profPic);
        card.appendChild(fullName);
        card.appendChild(email);
        gallery.appendChild(card);
    });
}
    
button.addEventListener('click',(e)=>{
    e.preventDefault();
    gallery.innerHTML="";
    getJSON();
});