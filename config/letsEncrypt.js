//import express and express router
var express = require('express');
var router = require('express').Router();

//URL for gcloud documentation = https://googlecloudplatform.github.io/google-cloud-node/#/docs/storage/1.2.0/storage/file
//import gcloud storage module
var gcs = require('@google-cloud/storage')();

//set bucket google bucket
const gcsBucket = gcs.bucket('acme-challenges-99uvtcrc58gsg98.chrismhurst.com');

//function to return the contents of the google file
var returnGcloudFileContents = (path) => {
  return new Promise((resolve, reject) => {
    var file = gcsBucket.file(path);
    console.log(file);
    file.download().then((fileData) => {
        resolve(fileData[0]);
      }).catch((err) => {
        reject(`Attempt to access file returned error: ${err.code} - ${err.message}`);
      });
  });
};

//turn path into param, and pass it to the returnGcloudFileContentsAsString function
router.get(`/:path`, (req, res) => {
  returnGcloudFileContents(req.params.path).then((gcloudFile) => {
    console.log(`Returned letsencrypt key: ${gcloudFile.toString()}`);
    res.send(gcloudFile);
  }).catch((err) => {
    console.log(err);
    res.send(err);
  });
});

//export express routes
module.exports = router;
