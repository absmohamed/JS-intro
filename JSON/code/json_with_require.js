const jsonObj = require('./json_example.json');
const fs = require('fs');

// Log the group name
let groupName = getGroupName(jsonObj);
console.log(`Group name: ${groupName}`);

// Log the location
let location = getLocation(jsonObj);
console.log(`Location: ${location}`);

// Get a member
let member = getMember(jsonObj, "A");
console.log(`Member:`, JSON.stringify(member));

// Add an activity
addActivity(member, "Recycle");
console.log(`Member: ${member.name}`)

// Log the member's activities
console.log("Activities:");
for (let activity of getActivities(member)) {
  console.log(activity);
}

// Store the updated object
storeObject(jsonObj);


// Returns the groupName
function getGroupName(group) {

}

// Returns the location
function getLocation(group) {

}

// Returns the member
function getMember(group, name) {

}

// Returns array of activities for the member
function getActivities(member) {

}

// Adds an activity to the array of activities for the member
function addActivity(member, activity) {

}

// Store the modified object back to the json file
function storeObject(jsonObj) {
  fs.writeFile('json_example.json', JSON.stringify(jsonObj), (err) => {
    if (err) {
      console.error("error occured writing json file")
    } else {
      console.log("Updated json file")
    }
  })
}