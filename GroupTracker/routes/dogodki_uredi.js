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

router.get('/:id', function(req, res, next) {
  new Dogodek({id: req.params.id}).fetch().then(function(dogodek){
    //res.send(priljubljena.get('oznaka'));
    res.render('dogodki_uredi',
    {
      title:'DogodkiUredi',
      do_cas:dogodek.get('cas'),
      do_koor:dogodek.get('koordinate'),
      do_upo:dogodek.get('uporabnik_id')
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
	new Dogodek().save(req.body).then(function(saved){
		res.redirect('/dogodki_uredi');
	});
});

module.exports = router;