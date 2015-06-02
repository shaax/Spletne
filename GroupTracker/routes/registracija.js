var express = require('express');
var router = express.Router();

var knex=require('knex')(require('../knexfile.js').development);
var bookshelf=require('bookshelf')(knex);







var Uporabnik = bookshelf.Model.extend({
  tableName:'uporabnik',


});


router.post('/', function(req, res, next) {

  var podatki = req.body;

  console.log("Podatki: " + JSON.stringify(podatki));
  var uporabnik = new Uporabnik().where({'up_ime' : podatki.up_ime}).fetch().then(function(rezultat){

    if(rezultat !== null && rezultat !== undefined){
      res.json(rezultat.toJSON());
    }
    else{
      new Uporabnik().save({'up_ime' : podatki.up_ime, 'geslo' : podatki.geslo, 'email' : podatki.email});
    
      res.json(null);
    }

  });
    
});


module.exports = router;