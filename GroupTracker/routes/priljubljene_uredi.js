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

router.get('/:id', function(req, res, next) {
  new Priljubljena({id: req.params.id}).fetch().then(function(priljubljena){
    //res.send(priljubljena.get('oznaka'));
    res.render('priljubljene_uredi',
    {
      title:'PriljubljeneUredi',
      pr_oznaka:priljubljena.get('oznaka'),
      pr_koor:priljubljena.get('koordinate'),
      pr_upo:priljubljena.get('uporabnik_id')
  });});
    /*res.render('priljubljene_uredi', {
      title:'PriljubljeneUredi',
      pr_oznaka:priljubljena.get('oznaka'),
      pr_koor:priljubljena.get('koordinate'),
      pr_upo:priljubljena.get('uporabnik_id')*/
    //console.log(priljubljena.get('oznaka'));
  
//Priljubljena.forge({id: req.params.id})
  //res.send(req.params.id);
  //res.render()
});


router.post('/',function(req,res,next){
	new Priljubljena().save(req.body).then(function(saved){
		res.redirect('/priljubljene_dodaj');
	});
});

module.exports = router;