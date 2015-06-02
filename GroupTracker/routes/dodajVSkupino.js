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
  var idUpo,idSkup;
  console.log("Podatki: " + JSON.stringify(podatki));
 
var skupinaUporabnik;
  new Uporabnik().where({'up_ime' : podatki.up_ime}).fetch().then(function(rez){
      idUpo=rez.toJSON().id;
      skupinaUporabnik= new SkupinaUporabnik().where({'uporabnik_id':idUpo});
  });
 
  new Skupina().where({'ime':podatki.ime,'geslo':podatki.geslo}).fetch().then(function(rez){
      idSkup=rez.toJSON().id;
      
      
      skupinaUporabnik.fetch().then(function(m) {
       if ( m == null ) {
         skupinaUporabnik.save({'uporabnik_id': idUpo,'skupina_id':idSkup}).then(function(m) {});
       }
       else {         
         
         new SkupinaUporabnik().where({'uporabnik_id':idUpo }).save({ 'skupina_id':idSkup }, { method: 'update' });
       }
         
       
     });




  });

  

  

  
    
});


module.exports = router;