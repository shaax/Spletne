var express = require('express');
var router = express.Router();


var knex=require('knex')(require('../knexfile.js').development);
var bookshelf=require('bookshelf')(knex);

var Priljubljena=bookshelf.Model.extend({
	tableName:'priljubljene',	
});

router.get('/:id', function(req, res, next) {
  new Priljubljena({id: req.params.id}).fetch().then(function(priljubljena){
    res.json(priljubljena.get('koordinate'));  	
  });
  //res.send("TEST");
  //res.render()
});

/*router.post('/',function(req,res,next){
	new Priljubljena().save(req.body).then(function(saved){
		res.redirect('/priljubljene');
	});
});*/

module.exports = router;