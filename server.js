//import-use fs library to write data to json file
const fs = require('fs');
const path = require('path'); //node.js module for files and directory paths

//process.env.PORT to deploy to port used by Heroku
const PORT = process.env.PORT || 3001;

//ROUTE FOR FRONT END TO REQUEST DATA
const { animals } = require('./data/animals.json');

//REQUIRE EXPRESS.JS TO FILE
const express = require('express');

//INSTANTIATE THE SERVER
const app = express();

//parse incoming data from client over HTTP and convert into JSON object
app.use(express.urlencoded({ extended: true })); //parse incoming string or array data
app.use(express.json()); // parse incoming JSON data

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
    path.join(__dirname, './data/animals.json'), // for data to be written to animals.json file
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




//GET ROUTES - test in the browser

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
//GET route for one specific animal using req.params
app.get ('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result); 
     //if no record exists for animal being searched for, return
    // a 404 error
    } else {
        res.send(404);
    }         
});

//POST ROUTES - test using fetch() request in insomnia

//POST Routes allow for information to be added 
//Listens for POST requests: client requesting the server to accept data
app.post('/api/animals', (req, res) => {
    // req.body is where our incoming cotnet will be
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();
    //Valdidate: -Aif any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)){
        res.status(400).send('The animal is not properly formatted.');
    } else {
      //add animal to json file and animals array in this function
    const animal = createNewAnimal(req.body, animals);

    res.json(animal); // used to send the data back to the client  
    }
});



//CHAIN THE LISTEN() METHOD ONTO THE SERVER
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`)
});
