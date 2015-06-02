var express = require('express');
var router = express.Router();


var knex=require('knex')(require('../knexfile.js').development);
var bookshelf=require('bookshelf')(knex);

var Dogodek=bookshelf.Model.extend({
  tableName:'dogodek',  
});
var Uporabnik=bookshelf.Model.extend({
  tableName:'uporabnik', 
});
router.get('/:id', function(req, res, next) {
  new Dogodek({id: req.params.id}).destroy().then(function(dogodek){
  	//dogodek.destroy();    
  });
  res.send(req.params.id);  
});


module.exports = router;

