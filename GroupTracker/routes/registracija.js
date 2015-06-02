var express = require('express');
var router = express.Router();

var knex=require('knex')(require('../knexfile.js').development);
var bookshelf=require('bookshelf')(knex);







var Uporabnik = bookshelf.Model.extend({
  tableName:'uporabnik',


});
var SkupinaUporabnik = bookshelf.Model.extend({
  tableName:'skupina_uporabnik',  
   uporabniki: function(){
    return this.belongsToMany(Uporabnik);
    }, 
    skupine: function(){
      return this.belongsToMany(Skupina);
    }
});


router.post('/', function(req, res, next) {

  var podatki = req.body;
  var idUpo;
  console.log("Podatki: " + JSON.stringify(podatki));
  //var skupinaUporabnik;


  var uporabnik = new Uporabnik().where({'up_ime' : podatki.up_ime}).fetch().then(function(rezultat){

    if(rezultat !== null && rezultat !== undefined){
      res.json(rezultat.toJSON());
    }
    else{
      new Uporabnik().save({'up_ime' : podatki.up_ime, 'geslo' : podatki.geslo, 'email' : podatki.email}).then(function(m) {
        /*new Uporabnik().where({'up_ime' : podatki.up_ime}).fetch().then(function(rezultat){
        idUpo=rezultat.toJSON().id;
        skupinaUporabnik.save({'uporabnik_id': idUpo,'skupina_id':999}).then(function(m) {});
    });*/
      new SkupinaUporabnik().save({'uporabnik_id': m.toJSON().id,'skupina_id':999}).then(function(m) {});
      console.log(m.toJSON());

      });
      
      res.json(null);
    }
    

  });
    
});


module.exports = router;