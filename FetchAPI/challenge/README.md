# API Challenge

## Description of the API
In this challenge, you will use the [BoredAPI](https://www.boredapi.com/documentation) to create a simple app.

In order to complete this activity, you will have to practice the following skills:
- Reading and understanding API documentation
- Call an API multiple times and handle the promise that is returned by each call
- Provide a form for a user to input data and to request a list of activities
- Use DOM manipulation to display a random list of activities based on what the user requested on the page

You can call the Bored API like this to get a random activity:

```javascript
let boredUrl = "http://www.boredapi.com/api/activity/"
fetch(boredUrl).then(response => response.json())
  .then(activity => console.log(activity))
```

You can also add query parameters to the url to search for activities based on a number of criteria, one of which is type. Valid types are:

["education", "recreational", "social", "diy", "charity", "cooking", "relaxation", "music", "busywork"]

Read the documentation to understand how to pass this paramater with the url. Read about the other optional parameters that could be used and play with using them.

## The challenge
The challenge is to create a simple one page app that allow a user to optionally specify:
- a type of activity (if none is given, get any random activity)
- the number of activities to show (by default, show 3 activities)

Display the correct number of activities on the page in a pleasing format. 

Remember to include a title for your page.