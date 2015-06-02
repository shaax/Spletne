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


router.post('/', function(req, res, next) {

  var podatki = req.body;

  console.log("Podatki: " + JSON.stringify(podatki));
  var skupina= new Skupina().where(req.body);
  skupina.fetch().then(function(m) {
       if ( m == null ) {
         skupina.save(req.body).then(function(m) {});
       }
       else {         
         console.log("Skupina že obstaja")
       }
     });
  /*new Skupina().save(req.body).then(function(rezultat){
    if(rezultat !== null && rezultat !== undefined)
      res.json(rezultat.toJSON());
    else
      res.json(null);

  });*/
    
});


module.exports = router;