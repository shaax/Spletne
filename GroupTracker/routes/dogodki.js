var express = require('express');
var router = express.Router();

var knex=require('knex')(require('../knexfile.js').development);
var bookshelf=require('bookshelf')(knex);

var Dogodek=bookshelf.Model.extend({
	tableName:'dogodek',	
});

router.get('/', function(req, res, next) {
  new Dogodek().fetchAll().then(function(dogodki){
  	//res.json(dogodki.toJSON());
  	//res.json({msg: 'This is CORS-enabled for all origins!'});
    console.log(dogodki.toJSON());

    if(dogodki !== null && dogodki !== undefined){

      res.json(dogodki.toJSON());
    }
    else
      res.json(null);

    /*res.render('dogodki', {
  		title:'Dogodki',
  		dogodkii:dogodki.toJSON()*/
  });
//});
  //res.send("TEST");
  //res.render()
});

/*router.post('/',function(req,res,next){
	new Priljubljena().save(req.body).then(function(saved){
		res.redirect('/priljubljene');
	});
});*/

module.exports = router;