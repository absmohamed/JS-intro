// ************************************************************************
// CONST declaration with ARRAYS 

const my_array1 = ["Reduce", "Reuse", "Recycle"];
console.log(my_array1);

my_array1[0] = "REDUCE"; // Allowed

my_array1 = ["REDUCE", "REUSE", "RECYCLE"]; 
//Not Allowed as we will be over-writing the array.

my_array1[0] = "Reduce";

for (let i in my_array1) // is this allowed ?? TRY IT !
{
    my_array1[i] = my_array1[i].toUpperCase();
}

// If you want your array to be imutable then use Object.freeze
Object.freeze(my_array1);
my_array1[1] = "reuse"; // TRY IT!
console.log(my_array1);

// Scope of execution for const variables
const my_array1 = ["Reduce", "Reuse", "Recycle"];
console.log(my_array1);
for (let i in my_array1) // Allowed ?? TRY IT !
{
    const my_array1 = ["REDUCE","REUSE","RECYCLE"];
    //my_array1[i] = my_array1[i].toUpperCase();
    console.log(my_array1[i]);
}
