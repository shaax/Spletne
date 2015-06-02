var express = require('express');
var router = express.Router();

var knex=require('knex')(require('../knexfile.js').development);
var bookshelf=require('bookshelf')(knex);



var Skupina = bookshelf.Model.extend({
  tableName:'skupina',
  uporabniki: function(){
    return this.belongsToMany(Uporabnik);
  } 
});



var Uporabnik = bookshelf.Model.extend({
  tableName:'uporabnik',
  skupine: function(){
      return this.belongsToMany(Skupina);
    }

});


router.post('/', function(req, res, next) {

  var podatki = req.body;

  console.log("Podatki: " + JSON.stringify(podatki));
  var uporabnik = new Uporabnik().where({'up_ime' : podatki.up_ime, 'geslo' : podatki.geslo}).fetch({withRelated: ['skupine']}).then(function(rezultat){

    if(rezultat !== null && rezultat !== undefined)
      res.json(rezultat.toJSON());
    else
      res.json(null);

  });
    
});


module.exports = router;