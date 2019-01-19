const express = require('express');

const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../models');

// Routes
// A GET route for scraping the echoJS website
router.get('/scrape', (req, res) => {
  // First, we grab the body of the html with axios
  axios.get('https://www.dndbeyond.com/posts').then((response) => {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $('article').each(function (i, element) {
      // Save an empty result object
      const result = {};
      result.link = $(this).find('meta').attr('content');
      result.title = $(this).find('div.post-excerpt > div.post-excerpt__content > div.post-excerpt__title > a').text();
     // scrape the image
      result.image = $(this).find('div.post-excerpt > div.post-excerpt__preview > a').attr('style');
      // clean up the image string to remove unnecessary elements
      result.image = result.image.slice(22);
      result.image = result.image.split(");").shift();

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then((dbArticle) => {
          // View the added result in the console
        })
        .catch((err) => {
          // If an error occurred, log it
          console.log(err.message);
        });
    });

    // Send a message to the client
    res.send('Scrape Complete');
  });
});

// Route for getting all Articles from the db
router.get('/articles', (req, res) => {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({})
    .then((dbArticle) => {
      res.json(dbArticle);
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// Route for saving/updating an Article's associated Note
router.post('/articles/:id', (req, res) => {
  // TODO
  // ====
  db.Note.create(req.body)
    .then(dbNote => db.Article.findOneAndUpdate(
      { $push: { note: dbNote._id } },
      { new: true },
    ))
    .then((dbArticle) => {
      res.json(dbArticle);
    })
    .catch((err) => {
      res.json(err);
    });
});

// Clear the DB
router.get("/deleteall", function(req, res) {
  // Remove every note from the notes collection
  db.Article.remove({}, function(error, response) {
    // Log any errors to the console
    if (error) {
      console.log(error);
      res.send(error);
    }
    else {
      // Otherwise, send the mongojs response to the browser
      // This will fire off the success function of the ajax request
      console.log(response);
      res.send(response);
    }
  });
});

module.exports = router;
