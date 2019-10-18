var express = require('express');
var router = express.Router();

const _ = require('lodash')

function indexRouter(dependencies){
  const { db,io} = dependencies

  io.on('connect', function(socket){
    console.log('a new client connected')
  })

  /* GET home page. */
  router.get('/', function(req, res, next) {
    const matches = db.get('matches').value()
    res.render('index', { matches });
  });

  router.get('/match/:id', function(req, res, next) {
    const matches = db.get('matches').value()
    const match = db.get('matches['+ req.params.id+']').value()
    match.bids = _.orderBy(match.bids, ['half', 'time'], ['desc', 'desc'])
    res.render('match', { matches, match, id: req.params.id });
  });

  return router
}

module.exports = indexRouter;
