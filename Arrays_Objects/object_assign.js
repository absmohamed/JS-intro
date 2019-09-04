// UPDATE OBJECT
// The following function will modify the original object by 
// adding the new values to it.

function updateObject(obj, key, value)
{
    obj[key] = value;
    return obj;
}

var myFavoriteColor = {yellow:'bright'};
console.log(updateObject(myFavoriteColor, 'pink', 'hot'));
//*********************************************************************************
// CREATE A NEW OBJECT (retain the old one)
// Object.assign() allows us to create a new object with the old and the new values 
// and also ensures that the old object remains untouched.

function createNewObject(obj, key, value)
{
    // the {} ensures that a new object gets created and the obj, 
    // obj is required to get the original object's properties for the new object,
    // {[key]:value} holds the new key:value pair.
    return Object.assign({}, obj, {[key]:value});
}

var myFavoriteColor = {blue:'navy'};
var allOfMyFavoriteColors = createNewObject(myFavoriteColor, 'green','olive')
console.log(myFavoriteColor);
console.log(allOfMyFavoriteColors);

//Try it !
//In the above function, remove the {} from Object.assign() and 
//execute the function.

//*********************************************************************************

// CREATE A NEW OBJECT ALTOGETHER BY PASSING 2 OBJECTS
var addNewColor = {amber:'dark'}
function updateObjectWithObject(addNewColor, allOfMyFavoriteColors)
{
    return Object.assign({}, addNewColor, allOfMyFavoriteColors);
}
var newObject = updateObjectWithObject(addNewColor, allOfMyFavoriteColors)
console.log(newObject);
console.log(addNewColor);
console.log(allOfMyFavoriteColors);

//*********************************************************************************

//DELETE A KEY-VALUE PAIR FROM AN OBJECT
console.log('Deleting a key value pair from an object');
delete allOfMyFavoriteColors.green;
console.log(allOfMyFavoriteColors);

//*********************************************************************************

//CHANGING THE VALUE OF A KEY IN AN OBJECT
console.log('Changing the value of a key in an object');
allOfMyFavoriteColors.green = ['olive','forest'];
console.log(allOfMyFavoriteColors);

//Try it !
//In the above example, use Object.assign()to 
//non-dectructively change the value of the key

//*********************************************************************************
