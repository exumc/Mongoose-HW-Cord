const express = require('express');
const cheerio = require('cheerio');

const router = express.Router();
const db = require('../models');

router.get('/', (req, res) => {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then((dbArticle) => {
      // If we were able to successfully find Articles, send them back to the client
      res.render('index', { dbArticle });
    })
    .catch((err) => {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


// // Render 404 page for any unmatched routes
// router.get('*', (req, res) => {
//   res.render('404');
// });

module.exports = router;
