var express = require('express');
var router = express.Router();

var knex=require('knex')(require('../knexfile.js').development);
var bookshelf=require('bookshelf')(knex);


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

var Uporabnik=bookshelf.Model.extend({
	tableName:'uporabnik',	
});

router.post('/posodobiLokacijo', function(req, res, next) {

  var podatki = req.body;
  console.log("PODATKI: " + JSON.stringify(podatki));
  

  new Uporabnik().where({'up_ime' : podatki.up_ime}).fetch().then(function(rez){

  	if(rez !== undefined && rez !== null){

  		var datum = new Date();
  		console.log("UPORABNIK: " + JSON.stringify(rez.toJSON()));
  		console.log("PODATKI KOOR: " + podatki.koor + "      " + rez.toJSON().koor);
  		if(podatki.koor !== rez.toJSON().koor && rez.toJSON().koor !== undefined){

  			console.log("UDPATAN");
  			 var uporabnik = new Uporabnik({'id' : rez.toJSON().id}).save({'koor' : String(podatki.koor), 'cas_zadnjega_premika' : datum}).then(function(rezultat){

		    if(rezultat !== null && rezultat !== undefined)
		      res.json(rezultat.toJSON().cas_zadnjega_premika);
		    else
		      res.json(null);

		  });
  		}
  		

  	}
  	else
  		res.json(null);
  		
  });
 
    
});

module.exports = router;
