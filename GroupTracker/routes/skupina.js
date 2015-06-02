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







router.get('/', function(req, res, next) {

  var uporabnikiSkupine = new Uporabnik().fetchAll({withRelated: ['skupine']}).then(function(rezultat){

    if(rezultat !== null && rezultat !== undefined)
      res.json(rezultat.toJSON());
    else
      res.json(null);

  });
    
});



router.get('/:id', function(req, res, next) {

  var uporabnikiSkupine = new Skupina().where({'id' : req.params.id}).fetch({withRelated: ['uporabniki']}).then(function(rezultat){

    if(rezultat !== null && rezultat !== undefined)
      res.json(rezultat.toJSON());
    else
      res.json(null);

  });
    
});

/*router.post('/',function(req,res,next){
	new Priljubljena().save(req.body).then(function(saved){
		res.redirect('/priljubljene');
	});
});*/

module.exports = router;