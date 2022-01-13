//Use router: which allows you to declare routes in any file with proper middleware
const path = require('path');
const router = require('express').Router();



//Add HTML files -> no JSON data end-points, so no api reference

//Route to GET the index.html file to display in the browser
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  });
//Route to GET animals.html file
router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
  });

//Route to GET zookeepers.html file
router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
  });

//wildcard route for requests to routes that do not exist
//Should always be last 
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  });

//export module
module.exports = router;
