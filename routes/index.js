const express = require('express');
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res) {
  res.redirect("/catalog");

  // Superseded Code
  // res.render('index', { title: 'Coding Notes' });
});

module.exports = router;
