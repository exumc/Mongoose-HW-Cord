const express = require('express');

const router = express.Router();

router.get('/', (req, res) => res.render('index'));

// Render 404 page for any unmatched routes
router.get('*', (req, res) => {
  res.render('404');
});

module.exports = router;
