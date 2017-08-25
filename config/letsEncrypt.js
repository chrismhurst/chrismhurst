//import express and express router
var express = require('express');
var router = require('express').Router();

//set constants for encryption from letsencrypt command
const letsEncryptPath = 'mVGn8u8ig4lhC2vAw1Zdeij01Tp_8DPl4WAfuzgi5uY';
const letsEncryptData = 'mVGn8u8ig4lhC2vAw1Zdeij01Tp_8DPl4WAfuzgi5uY.LToI9ULE3ZWttdyea0mmptp7V5-4nBbh847mSuHamJs';
const wwwletsEncryptPath = 'zfFTa2M2qEUyxfO7DyB9c-0aEl4YyIDIolAOtR1H-1o';
const wwwletsEncryptData = 'zfFTa2M2qEUyxfO7DyB9c-0aEl4YyIDIolAOtR1H-1o.LToI9ULE3ZWttdyea0mmptp7V5-4nBbh847mSuHamJs';



//make router path for letsencrypt
router.get(`/${letsEncryptPath}`, (req, res) => {
  res.send(letsEncryptData);
})

//make router path for www pathed site
router.get(`/${wwwletsEncryptPath}`, (req, res) => {
  res.send(wwwletsEncryptData);
})

module.exports = router;
