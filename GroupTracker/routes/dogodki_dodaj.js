var express = require('express');
var router = express.Router();


var knex=require('knex')(require('../knexfile.js').development);
var bookshelf=require('bookshelf')(knex);

var Dogodek=bookshelf.Model.extend({
	tableName:'dogodek',	
});

var Uporabnik=bookshelf.Model.extend({
  tableName:'uporabnik', 
});

router.get('/', function(req, res, next) {    
    new Uporabnik().fetchAll().then(function(uporabniki){
    //res.json(priljubljene.toJSON());
    res.render('dogodki_dodaj', {
      title:'DogodkiDodaj',
      uporabnik:uporabniki.toJSON()
  });});


  //res.send("TEST");
  //res.render()
});

router.post('/',function(req,res,next){
	new Dogodek().save(req.body).then(function(saved){
		res.redirect('/dogodki_dodaj');
	});
});

module.exports = router;