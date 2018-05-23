var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var conf = require('../config');
var util = require('../util');

/* GET users listing. */
router.get('/', all);

// Add new user
router.post('/add', add);

function all(req, res, next) {
    MongoClient.connect(conf.database, (err, db) => {
      var page = parseInt(req.params.pn) - 1 || 0;
      var count = parseInt(req.params.limit) || 10;
      db.collection('Company').find().toArray((err, users) => {
        res.json(util.success(users, 'All Companies.'));
      });
    });
  }
  
  function add(req, res, next) {
    MongoClient.connect(conf.database, (err, db) => {
      req.body.createdAt = Date.now();
      db.collection('Company').insert(req.body, (err, result) => {
        res.json(util.success(result, 'Company Added.'));
      });
    });
  }

  module.exports = router;