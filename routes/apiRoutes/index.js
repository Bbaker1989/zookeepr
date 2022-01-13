/* add middleware so that our app knows
about the routes in animalRoutes.js
*/

//file will be central hub for all routing functions

const router = require('express').Router();
const animalRoutes = require('../apiRoutes/animalRoutes');

//middleware for router to animal routes
router.use(animalRoutes);
//middleware for router to zookeeper routes
router.use(require('./zookeeperRoutes'));

module.exports = router;