const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* Sample Users Route */
router.get('/sample', function(req, res, next) {
  res.send('Sample Users Route');
});

module.exports = router;
