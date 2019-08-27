// ************************************************************************
// CONST declaration with OBJECTS 

const my_object1 = {key1:'value1'};
console.log(my_object1);
// When objects are declared as a "const" the value for a key can be changed.
my_object1.key1 = 'value2'; //Allowed
console.log(my_object1);
Object.freeze(my_object1);
my_object1.key1 = 'value3'; 
// Object.freeze will ensure that the value of key1 will be retained!
console.log(my_object1);

// When an object is declared as a "const", we can also add new properties to it.
const my_object2 = {key1:'value1',key2:'value2',key3:'value3'};
my_object2.key4 = 'value4';
console.log(my_object2);

// However, when objects are declared as a "const" they cannot be overwritten
// Try this!
// my_object1 = {key2:'value2'}; //TypeError: Assignment to constant variable.
// What could be the reason for the above error? 
// my_object1 has just the one key-value pair and if that is getting overwritten by 
// {key2:'value2'}, then it is over writing the const object. 

