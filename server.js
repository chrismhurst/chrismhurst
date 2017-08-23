//import express
const express = require('express')

//'port' needed for heroku
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

//tells express that static site content can be found at /public
app.use(express.static(__dirname + '/public'));

app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
