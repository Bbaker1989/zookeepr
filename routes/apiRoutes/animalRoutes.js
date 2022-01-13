//Use router: which allows you to declare routes in any file with proper middleware
const router = require('express').Router();


//Import functions from lib/animals.js and data/animals
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');



//GET ROUTES - test in the browser

//ROUTE FOR GET ANIMAL FILE REQUEST AND SEND RESPONSE
//Information will return in a JSON format
//Query for specific objects in the request
router.get('/animals', (req, res) => {
    let results = animals;
    //return query results to user
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});
//GET route for one specific animal using req.params
router.get ('/animals/:id', (req, res) => {
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
router.post('/animals', (req, res) => {
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

//export the router
module.exports = router;