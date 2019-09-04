// Simple example for a class : Person
class Person { 
    constructor(firstName, lastName) {
      this.firstName = firstName;
      this.lastName = lastName;
    }
     nationality(country){
         this.country = country
         console.log(`${this.firstName} ${this.lastName} is from ${this.country}`);
     }
  }

// The constructor method is called automatically when 
// the object is initialized
let p = new Person("Steve","Irwin");
p.nationality("Australia");
