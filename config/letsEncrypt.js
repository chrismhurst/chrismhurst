//import express and express router
var express = require('express');
var router = require('express').Router();

//set constants for encryption from letsencrypt command
const letsEncryptPath = '24bpJ6_K_tE6MD0NTdEtcBAisyxfd7ZsrB2_-gCWtEs';
const letsEncryptKey = '24bpJ6_K_tE6MD0NTdEtcBAisyxfd7ZsrB2_-gCWtEs.Oc9qqVSPRacPuT0q-3JMqktI6EmK16zrNWzgmy1JpAo';


router.get(`/${letsEncryptPath}`, (req, res) => {
  res.send(letsEncryptKey);
})

module.exports = router;
