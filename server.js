const express = require('express');
const exphbs = require('express-handlebars');

const logger = require('morgan');
const mongoose = require('mongoose');
const Handlebars = require('handlebars')
const PORT = process.env.PORT || 8080;

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
    defaultLayout: 'main'
  }),
);
app.set('view engine', 'handlebars');

//handlebar helper
Handlebars.registerHelper('grouped_each', function (every, context, options) {
  var out = "", subcontext = [], i;
  if (context && context.length > 0) {
    for (i = 0; i < context.length; i++) {
      if (i > 0 && i % every === 0) {
        out += options.fn(subcontext);
        subcontext = [];
      }
      subcontext.push(context[i]);
    }
    out += options.fn(subcontext);
  }
  return out;
});

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoNewsScraper";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Import routes and give the server access to them.
const htmlRoutes = require('./routes/htmlRoutes');
const apiRoutes = require('./routes/apiRoutes');

app.use('/', htmlRoutes);
app.use('/api', apiRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
