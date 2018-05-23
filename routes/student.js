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

function all(req, res, next) {
    MongoClient.connect(conf.database, (err, db) => {
      var page = parseInt(req.params.pn) - 1 || 0;
      var count = parseInt(req.params.limit) || 10;
      db.collection('Students').find().toArray((err, users) => {
        res.json(util.success(users, 'All Students.'));
      });
    });
}

function add(req, res, next) {
    MongoClient.connect(conf.database, (err, db) => {
        req.body.createdAt = Date.now();
        db.collection('Students').insert(req.body, (err, result) => {
        res.json(util.success(result, 'Student Added.'));
        });
    });
}

function update(req, res, next) {
    MongoClient.connect(conf.database, (err, db) => {
      req.body._id = mongo.ObjectID(req.body._id)
      db.collection('Students').findOneAndUpdate({
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
        db.collection('Students').findOne({
          'userId': req.params.id
        }).then((result) => {
          res.json(util.success(result, 'Students details of given id.'));
        }).catch((err) => next(err));
      });
    } else {
      res.json(util.failure('User not found.'));
    }
};

module.exports = router;