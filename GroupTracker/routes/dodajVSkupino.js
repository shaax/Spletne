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
  //var uporabnik = new Uporabnik().where({'up_ime' : "test"}).fetch();
  
  
  //JSON.parse(uporabnik).up_ime
var skupinaUporabnik;
  new Uporabnik().where({'up_ime' : podatki.up_ime}).fetch().then(function(rez){
      idUpo=rez.toJSON().id;
      skupinaUporabnik= new SkupinaUporabnik().where({'uporabnik_id':idUpo});
  });
  //{'ime' : podatki.ime, 'geslo' : podatki.geslo}
  /*var skupina=new Skupina().where({'ime' : podatki.ime, 'geslo' : podatki.geslo}).fetch().then(function(rezultat){
    console.log("skupina: "+skupina.ime)

    if(rezultat !== null && rezultat !== undefined){
      
    
      res.json(rezultat.toJSON());}
    else
      res.json(null);

  });*/
  new Skupina().where({'ime':podatki.ime,'geslo':podatki.geslo}).fetch().then(function(rez){
      idSkup=rez.toJSON().id;
      //console.log("idUpo: "+idUpo + "idSkup: " + idSkup);
      
      skupinaUporabnik.fetch().then(function(m) {
       if ( m == null ) {
         skupinaUporabnik.save({'uporabnik_id': idUpo,'skupina_id':idSkup}).then(function(m) {});
       }
       else {         
         //skupinaUporabnik.save({'skupina_id':2});
         new SkupinaUporabnik().where({'uporabnik_id':idUpo }).save({ 'skupina_id':idSkup }, { method: 'update' });
       }
         //console.log("Skupina že obstaja")
       
     });




  });

  //console.log("idUpo: "+idUpo + "idSkup: " + idSkup);
  
  //var skupinaUporabnik= new SkupinaUporabnik().where({'uporabnik_id':4});
  
  

  /*if (skupina!==null){
    console.log("skupina: "+skupina.ime)
  }
  new Skupina({'id': 1}).save().then(function(skupina){     
        return skupina.uporabniki().attach(4);
      }).catch(function(error){
        console.log(error);
      });  */

  

  
    
});


module.exports = router;