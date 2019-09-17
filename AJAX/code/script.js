 
    var header = document.querySelector('header');
    var section = document.querySelector('section');
    let jsonObj = null;
    // create XHR
    let request = new XMLHttpRequest();
    // open connection
    request.open('GET','json_example.json');
    // define event listener and callback
    // request.onload is same as request.addEventListener('load',callback)
    request.onload = function () {
        jsonObj = JSON.parse(this.response);
        populateHeader();
        showMembers();
    };

    // the request has to be sent
    request.send(); 
    
    function populateHeader() 
    {
    var myH1 = document.createElement('h1');
    myH1.textContent = jsonObj["groupName"]; //jsonObj.groupname
    header.appendChild(myH1);
    var myPara = document.createElement('p');
    myPara.textContent = 'Location: ' + jsonObj["location"];
    header.appendChild(myPara);
    }

    function showMembers() 
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
        myList.setAttribute("id",members[i].name)

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

    // Creating a form to add an activity to a member.
    let form = document.createElement("form");
    form.name = members[i].name;
    console.log(form.name);
    let textField = document.createElement("input");
    textField.type = "text";
    form.appendChild(textField);
    button = document.createElement("input");
    button.type = "submit";
    form.appendChild(button);
    form.addEventListener("submit", addActivity); 
    // addActivity is a callback function
    // The callback function is invoked and the control immediately goes over to the following statements seen below

    // Append all the child nodes to their respective parent nodes
    myArticle.appendChild(myH2);
    myArticle.appendChild(myPara1);
    myArticle.appendChild(myPara2);
    myArticle.appendChild(myList);
    myArticle.appendChild(form);
    section.appendChild(myArticle);

    } // end of for (var i = 0; i < members.length; i++)


    }// end of showMembers()

    // callback function to handle submit on the form to add an activity
    function addActivity(event) {
        event.preventDefault();
        let form = event.target;
        let memberName = form.name;
        let newActivity = form.elements[0].value;
        
        // add the activity to the object    
        if (newActivity)
        {
            let list = document.getElementById(memberName);
            let li = document.createElement("li");
            li.textContent = newActivity;
            list.appendChild(li);
            getMember(memberName).activities.push(newActivity);
        }
        else{
            window.alert("Please enter an activity");
            return;
        }
        form.elements[0].value = null;
    } // End of callback function addActivity

    // Gets the member object
    function getMember(name)
    {
        for (let member of jsonObj.members){
            if(member.name === name){
                return member;
            }
        }
        return {};
    }