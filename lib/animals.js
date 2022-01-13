//Required dependencies
const fs = require("fs");
const path = require("path");

//Function filterByQuery for specific requests/parameters
function filterByQuery(query, animalsArray) {
    //query for mutliple traits
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
      // Save personalityTraits as a dedicated array.
      // If personalityTraits is a string, place it into a new array and save.
      if (typeof query.personalityTraits === 'string') {
        personalityTraitsArray = [query.personalityTraits];
      } else {
        personalityTraitsArray = query.personalityTraits;
      }
      // Loop through each trait in the personalityTraits array:
      personalityTraitsArray.forEach(trait => {
        // Check the trait against each animal in the filteredResults array.
        // Remember, it is initially a copy of the animalsArray,
        // but here we're updating it for each trait in the .forEach() loop.
        // For each trait being targeted by the filter, the filteredResults
        // array will then contain only the entries that contain the trait,
        // so at the end we'll have an array of animals that have every one 
        // of the traits when the .forEach() loop is finished.
        filteredResults = filteredResults.filter(
          animal => animal.personalityTraits.indexOf(trait) !== -1
        );
      });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter (animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter (animal => animal.name === query.name);
    }
    return filteredResults;
}

//Function findById() that takes in the id and array of animals
//Returns a single animal object
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

//Function to handle taking the data from req.body and adding it to animals.json file
function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal); // .push() is used to save data in local file
   fs.writeFileSync( //synchronous version of fs.writeFile(), doesnt require callback function
    path.join(__dirname, "../data/animals.json"), // for data to be written to animals.json file
    JSON.stringify({ animals: animalsArray }, null, 2) // save the JavaScript array data as JSON
        //null and 2 format data
        //null: we dont want to edit any of our exsisting data
        //2: want to create white space between our values to make more readable

    );

    //return fuinished code to post route for response
    return animal;
}

//function to vadilate new animal fata from req.bdoy 
//check if each key exists and is the right type of data
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string'){
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string'){
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
}

//export functions using module.exports
module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
};