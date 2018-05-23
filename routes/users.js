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

// Find one 
router.get('/find/:id', findById);

// Update user
router.post('/update', update);

// Remove user
router.get('/remove/:id', remove);

function all(req, res, next) {
  MongoClient.connect(conf.database, (err, db) => {
    var page = parseInt(req.params.pn) - 1 || 0;
    var count = parseInt(req.params.limit) || 10;
    db.collection('Users').find().toArray((err, users) => {
      res.json(util.success(users, 'All users.'));
    });
  });
}

function add(req, res, next) {
  MongoClient.connect(conf.database, (err, db) => {
    req.body.createdAt = Date.now();
    req.body.isAdmin = false;
    const sp = req.body.email.split('@');
    req.body.password = sp[0] + req.body.mobile.substring(6, 10);
    db.collection('Users').insert(req.body, (err, result) => {
      res.json(util.success(result, 'User Added.'));
    });
  });
}

function update(req, res, next) {
  MongoClient.connect(conf.database, (err, db) => {
    req.body._id = mongo.ObjectID(req.body._id)
    db.collection('Users').findOneAndUpdate({
      '_id': req.body._id
    }, {
        '$set': req.body
      }, {
        returnOriginal: false
      }, (err, result) => {
        if(err) next(err);
        else res.json(util.success(result, 'User updated.'));
      });
  });
}

function findById(req, res, next) {
  if (req.params.id) {
    MongoClient.connect(conf.database, (err, db) => {
      db.collection('Users').findOne({
        '_id': mongo.ObjectId(req.params.id)
      }).then((result) => {
        res.json(util.success(result, 'User details of given id.'));
      }).catch((err) => next(err));
    });
  } else {
    res.json(util.failure('User not found.'));
  }
};

function remove(req, res, next) {
  MongoClient.connect(conf.database, (err, db) => {
    db.collection('Users').deleteOne({
      '_id': mongo.ObjectId(req.params.id)
    }).then((result) => {
      res.json(util.success(result, 'User removed.'));
    }, (err) => next(err));
  });
}

module.exports = router;
