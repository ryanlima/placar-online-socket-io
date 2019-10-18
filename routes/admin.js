var express = require('express');
var router = express.Router();

const _ = require('lodash')

function adminRouter(dependencies){
  const { db,io} = dependencies

  
  router.get('/', function(req, res, next) {
    const matches = db.get('matches').value()
    res.render('admin/index', { matches });
  });

  router.get('/match/:id', function(req, res, next) {
    const matches = db.get('matches').value()
    const match = db.get('matches['+ req.params.id+']').value()
    match.bids = _.orderBy(match.bids, ['half', 'time'], ['desc', 'desc'])
    res.render('admin/match', { matches, match, id: req.params.id });
  });

  router.post('/match/:id/score', function(req, res){
    db.set('matches['+req.params.id+'].team-a.score',
      parseInt(req.body.scoreA)).write()
    db.set('matches['+req.params.id+'].team-b.score',
      parseInt(req.body.scoreB)).write()

    io.emit('score', {
      match: req.params.id,
      scoreA: req.body.scoreA,
      scoreB: req.body.scoreB,
      notify: req.body.notify || 0
    })
    res.send(req.body)
  })

  return router
}

module.exports = adminRouter;
