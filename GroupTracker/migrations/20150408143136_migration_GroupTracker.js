'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('uporabnik', function(table){
	table.increments('id').primary();
	table.text('up_ime');
	table.text('geslo');
	table.text('email');
	table.text('koor');
	table.datetime('cas_zadnjega_premika');
})
	.createTable('skupina', function(table){
	table.increments('id').primary();
	table.text('ime');
	table.text('geslo');
})
	.createTable('priljubljene', function(table){
	table.increments('id').primary();
	table.text('oznaka');
	table.text('koordinate');
	table.integer('uporabnik_id').references('id').inTable('uporabnik');
})
	.createTable('skupina_uporabnik', function(table){
	table.increments('id').primary();
	table.integer('uporabnik_id').references('id').inTable('uporabnik');
	table.integer('skupina_id').references('id').inTable('skupina');
	table.text('koordinate');
	table.datetime('cas');
})
	.createTable('dogodek',function(table){
	table.increments('id').primary();
	table.datetime('cas');
	table.text('koordinate');
	//table.text('opis');
	table.integer('uporabnik_id').references('id').inTable('uporabnik');
});
};

exports.down = function(knex, Promise) {
	  return knex.schema.dropTable('uporabnik')
  		.dropTable('skupina')
  		.dropTable('priljubljene')
  		.dropTable('uporabnik_skupina')
  		.dropTable('dogodek');
  
};
