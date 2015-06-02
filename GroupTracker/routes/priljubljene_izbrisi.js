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
  new Priljubljena({id: req.params.id}).destroy().then(function(priljubljena){  	
    
    console.log('+');
  });
//Priljubljena.forge({id: req.params.id})
  res.send(req.params.id);
  //res.render()
});
/*router.route('/priljubljene_izbrisi/:id').delete(function (req, res) {
    Priljubljena.forge({id: req.params.id})
    .fetch({require: true})
    .then(function (priljubljena) {
      priljubljena.destroy()
  });
  //res.send("TEST");
  //res.render()
});


router.post('/',function(req,res,next){
	new Priljubljena().save(req.body).then(function(saved){
		res.redirect('/priljubljene_dodaj');
	});
});*/

module.exports = router;

