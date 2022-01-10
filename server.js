//ROUTE FOR FRONT END TO REQUEST DATA
const { animals } = require('./data/animals.json');
//REQUIRE EXPRESS.JS TO FILE
const express = require('express');
//INSTANTIATE THE SERVER
const app = express();

//filterByQuery for specific requests/parameters
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

//ROUTE FOR GET ANIMAL FILE REQUEST AND SEND RESPONSE
//Information will return in a JSON format
//Query for specific objects in the request
app.get('/api/animals', (req, res) => {
    let results = animals;
    //return query results to user
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});
//CHAIN THE LISTEN() METHOD ONTO THE SERVER
app.listen(3001, () => {
    console.log(`API server now on port 3001!`)
});
