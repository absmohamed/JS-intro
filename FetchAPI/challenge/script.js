let url = "http://www.boredapi.com/api/activity/"
//event handler callback function

// get the type and number of activities from the form

// Create the url string 
function submitForm(event) {
    console.log("in submitForm");
    event.preventDefault();
    let type = event.target.elements[0].value;
    let number = event.target.elements[1].value;
    console.log("number");
    getActivity(number, type, displayFunction);
} 

async function getActivity(count, type, displayFunction) {
    let promises = [];
    for (let i = 0; i< count; i++) {
        if (type === 'random') {
            let act = fetch(url);
            let promise = act.then(response => response.json())
            .then(function (response) {
                return response;
            })
            .catch(err => console.error(err))
            promises.push(promise);
        } else {
            let act = fetch(`${urlType}${type}`);
            let promise = act.then(response => response.json())
                .then(function (response) {
                    return response;
                })
                .catch(err => console.error(err))
            promises.push(promise);
        }
    }
    displayFunction(await Promise.all(promises));
}
// Callback to display the results of the api calls
function displayFunction(activities) {
    console.log(activities);
    let activityDiv = document.createElement("div");
    document.body.append(activityDiv);
    for (let activity of activities) {
        let actP = document.createElement("p");
        activityDiv.appendChild(actP);
        actP.textContent = activity.activity;
    }
}

// Add an event listener to the form 
let form = document.getElementById("activity-form").addEventListener("submit", submitForm)