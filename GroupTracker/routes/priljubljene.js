var express = require('express');
var router = express.Router();


var knex=require('knex')(require('../knexfile.js').development);
var bookshelf=require('bookshelf')(knex);

var Priljubljena=bookshelf.Model.extend({
	tableName:'priljubljene',	
});

router.get('/', function(req, res, next) {
  new Priljubljena().fetchAll().then(function(priljubljene){
  	//res.json(priljubljene.toJSON());
  	//res.render('priljubljene', {
  		//title:'Priljubljene',
  	//	priljubljeni:priljubljene.toJSON()
  //});

      if(priljubljene !== null && priljubljene !== undefined){

        res.json(priljubljene.toJSON());
      }
      else
        res.json(null);
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