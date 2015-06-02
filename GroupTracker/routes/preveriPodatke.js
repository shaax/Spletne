var express = require('express');
var router = express.Router();


var knex=require('knex')(require('../knexfile.js').development);
var bookshelf=require('bookshelf')(knex);

var Uporabnik=bookshelf.Model.extend({
	tableName:'uporabnik',	
});

router.get('/:up/:gesl', function(req, res, next) {
  var date = new Date();
  new Uporabnik({up_ime: req.params.up,geslo:req.params.gesl}).fetch().then(function(uporabnik){  	
    if(uporabnik){
    	res.json("true");
    	console.log(date.getHours()+":"+date.getMinutes()+" - "+uporabnik.get('up_ime')+"   TRUE");
    }
    else {
    	res.json("false");
    	console.log(date.getHours()+":"+date.getMinutes()+" - "+req.params.up+"   FALSE");
    }
    
  });  
});

module.exports = router;