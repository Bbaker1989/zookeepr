//import API/HTML routes from other files
//the require() will read the index.js file of each directory (which is default)
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

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

//express.static method to include everything from public file
app.use(express.static('public')); //can be accessed without specific server endpoint

//parse incoming data from client over HTTP and convert into JSON object
app.use(express.urlencoded({ extended: true })); //parse incoming string or array data
app.use(express.json()); // parse incoming JSON data

//tells server that anytime the client naviages to
// <ourhost>/api, the app will use the router we set up in apiRoutes
//if '/' is the endpoint: router will serve back to our HTML routes

app.use('/api', apiRoutes);
app.use('/', htmlRoutes); // back to HTML routes


//CHAIN THE LISTEN() METHOD ONTO THE SERVER
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`)
});
