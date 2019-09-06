  // savePlanetEarth is a JSON object
    var savePlanetEarth = {
        "groupName": "Save Planet Earth",
        "location": "Brisbane",
        "formed": 2019,
        "members": [
          {
            "name": "A",
            "age": 25,
            "activities": [
              "Uses a Keep Cup",
              "Uses a Cloth Bag"
            ]
          },
          {
            "name": "B",
            "age": 39,
            "activities": [
              "Has a veggie patch",
              "Does composting"
            ]
          },
          {
            "name": "C",
            "age": 49,
            "activities": [
              "Buys groceries in bulk",
              "Rain Water Harvesting"
            ]
          }
        ]
      }

// First we have the variable name — savePlanetEarth.
// Inside that we want to access the members property, so we use members[].
// members contains an array of objects. 
// We want to access the first object inside the array, so we use [0].
// Inside this object, we want to access the activities property, so we use activities[].
// Inside the activities property is an array containing the selected member's activities. 

var header = document.querySelector('header');
var section = document.querySelector('section');
populateHeader(savePlanetEarth);
showMembers(savePlanetEarth);
  
function populateHeader(jsonObj) 
{
  var myH1 = document.createElement('h1');
  myH1.textContent = jsonObj["groupName"];
  header.appendChild(myH1);
  var myPara = document.createElement('p');
  myPara.textContent = 'Location: ' + jsonObj["location"];
  header.appendChild(myPara);
}

function showMembers(jsonObj) 
{
  // Variable members stores an array of multiple objects that store information
  // of all the members of the Save Planet Earth group.
  var members = jsonObj["members"];
      
  for (var i = 0; i < members.length; i++) {
    var myArticle = document.createElement('article');
    var myH2 = document.createElement('h2');
    var myPara1 = document.createElement('p');
    var myPara2 = document.createElement('p');
    var myList = document.createElement('ul');

    myH2.textContent = members[i].name;
    myPara1.textContent = 'Age: ' + members[i].age;
    myPara2.textContent = 'Activities:';
    
    // Store the activities that each member does in another array.
    var activities = members[i].activities;
    for (var j = 0; j < activities.length; j++) 
    {
      // Create a variable listItem to append the list of activities that 
      // each of the members do to myList
      var listItem = document.createElement('li');
      listItem.textContent = activities[j];
      myList.appendChild(listItem);
    } // end of for (var j = 0; j < activities.length; j++) 


  myArticle.appendChild(myH2);
  myArticle.appendChild(myPara1);
  myArticle.appendChild(myPara2);
  myArticle.appendChild(myList);
  section.appendChild(myArticle);
  } // end of for (var i = 0; i < members.length; i++)
}