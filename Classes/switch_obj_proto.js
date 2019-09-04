function Person(first, last, age) {
    this.firstName = first;
    this.lastName = last;
    this.age = age;
}

let albert = new Person("Albert", "Einstein", 100);
// Adding nationality to Person
Person.prototype.nationality = function (country){
    switch (country){
        case "India":
            return "Indian";
        case "Australia":
            return "Australian";
        case "Germany":
            return "German";
        default:
            return "No Country Specified";
    } // End of switch statement
} // End of function
console.log(albert.nationality("Germany")); 

let steve = new Person("Steve", "Irwin", 50);
console.log(steve.nationality("Australia")); 
