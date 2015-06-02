var express = require('express');
var router = express.Router();


var knex=require('knex')(require('../knexfile.js').development);
var bookshelf=require('bookshelf')(knex);

var Priljubljena=bookshelf.Model.extend({
	tableName:'priljubljene',	
});
var Uporabnik=bookshelf.Model.extend({
  tableName:'uporabnik', 
});

router.get('/', function(req, res, next) {
  new Uporabnik().fetchAll().then(function(uporabniki){
    //res.json(priljubljene.toJSON());
    res.render('priljubljene_dodaj', {
      title:'PriljubljeneDodaj',
      uporabnik:uporabniki.toJSON()
  });});
  //res.send("TEST");
  //res.render()
});


router.post('/',function(req,res,next){
	new Priljubljena().save(req.body).then(function(saved){
		res.redirect('/priljubljene_dodaj');
	});
});

module.exports = router;