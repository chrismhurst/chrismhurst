//import express
const express = require('express')

//import letsencrypt
const letsEncrypt = require('./config/letsEncrypt.js');

//'port' needed for heroku and google app engine
const port = process.env.PORT || 3000;

//initiate express
var app = express();

//middleware to log to console
app.use((req, res, next) => {
  var now = Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  next();
});

//middleware for letsencrypt
app.use('/.well-known/acme-challenge', letsEncrypt);

//serve static content dynamically from /public
app.use(express.static(__dirname + '/public'));

//starts node.js app on port
app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
