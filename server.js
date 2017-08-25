//import express
const express = require('express')

//require fs
const fs = require('fs');

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

//manual path for letsencrypt !fix me later!
app.get('/.well-known/acme-challenge/N_zQ_epFPTJ6X0t_xkmj1ZM3mad9L5UR-1GBV11DlAg', (req, res) => {
  res.send('N_zQ_epFPTJ6X0t_xkmj1ZM3mad9L5UR-1GBV11DlAg.Oc9qqVSPRacPuT0q-3JMqktI6EmK16zrNWzgmy1JpAo')
});

//starts node.js app on port
app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
