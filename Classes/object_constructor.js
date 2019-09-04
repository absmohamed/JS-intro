// function Person() is an object constructor function.
function Person(first, last, yearOfBirth) {
    console.log(this);
    this.firstName = first;
    this.lastName = last;
    this.yearOfBirth = yearOfBirth;
  }
  // Create a new object "albert" of type Person.
  let albert = new Person("Albert", "Einstein", 1925);

  // "albert" is now an object of type Person an has a constructor function.
  console.log(albert instanceof Person);
  console.log(albert.constructor === Person);

  // We can add a new property to an object as seen below.
  // However,that does not change the contructor
  albert.gender = "Male";
  console.log(albert.gender);

  // Try it 
  // Person.prototype.gender = "female";
  // console.log(albert.gender); 

  // Adding nationality property to Person. 
  // Using .prototype, we can ensure that any new object created after defining that property,
  // will be able to use that property. (As the folowing examples show: )
  Person.prototype.nationality = "German";
  console.log(albert.nationality);

  // Adding name property to Person 
  Person.prototype.name = function () {
    return `${this.firstName} ${this.lastName}`;
  }
  console.log("Full name:", albert.name());

  // Adding age property to Person
  Person.prototype.age= function(){ 
    return 2019 - this.yearOfBirth; 
} 
  console.log("Age:", albert.age());

  // Adding pets property to Person
  Person.prototype.pets = ["Dog", "Cat", "Kangaroo", "Gecko", "Crocodile"];
  console.log(albert.pets[2]);



