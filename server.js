const express = require('express');
const exphbs = require('express-handlebars');

const logger = require('morgan');
const mongoose = require('mongoose');

const PORT = 8080;

// Initialize Express
const app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger('dev'));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static('public'));

// set up handlebars
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main',
  }),
);

app.set('view engine', 'handlebars');

// Connect to the Mongo DB
mongoose.connect(
  'mongodb://localhost/mongoNewsScraper',
  { useNewUrlParser: true },
);

// Import routes and give the server access to them.
const htmlRoutes = require('./routes/htmlRoutes');
const apiRoutes = require('./routes/apiRoutes');

app.use('/', htmlRoutes);
app.use('/api', apiRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
