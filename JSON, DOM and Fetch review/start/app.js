const url = "https://randomuser.me/api/?results=12";
const gallery = document.getElementById('gallery');
const button = document.querySelector('.button');

//asynchronous function to get the JSON document from the url

function getJSON() {
    fetch(url).then(response => response.json())
        .then(data => showUsers(data))
        .catch( e => {
            gallery.innerHTML = "<h3>OOOOPS... Something went wrong!</h3>";
            console.error(e);
        });

}
getJSON();

function showUsers(data) {
    console.log(data.results);
    data.results.forEach((user, index) => {
        // console.log(index+" "+user.name.first+ " "+user.name.last+": "+user.email);
        const card = document.createElement('div');
        card.className = 'card';

        const profPic = document.createElement('img');
        profPic.setAttribute('src', user.picture.large);
        card.appendChild(profPic);



        const fullName = document.createElement('p');
        fullName.textContent = user.name.first+" "+user.name.last;
        card.appendChild(fullName);

        const email = document.createElement('p');
        email.textContent = user.email;
        card.appendChild(email);

        gallery.appendChild(card);

    });


    button.addEventListener('click', () =>{
        gallery.innerHTML="";
        getJSON();
    });
}