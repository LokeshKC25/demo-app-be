var express = require('express');
var conf = require('../config');
var mongo = require('mongodb');
var util = require('../util');
var router = express.Router();

var MongoClient = mongo.MongoClient;

// Login
router.post('/login', login);

function login(req, res, next) {
    if (req.body.userId && req.body.password) {
      MongoClient.connect(conf.database, (err, db) => {
        db.collection('Users').findOne({
          'email': req.body.userId
        }).then((user) => {
          if (user && (user.password === req.body.password)) {
            delete user.password;
            res.json(util.success(user, 'Login successful.'));
          } else {
            res.json(util.failure('Login failed.'));
          }
        }, (err) => next(err));
      });
    } else {
      res.json(util.failure('Login failed.'));
    }
}

module.exports = router;