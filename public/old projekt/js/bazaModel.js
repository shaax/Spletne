
persistence.store.websql.config(persistence, 'baza', 'baza za aplikacijo GroupTracker', 5 * 1024 * 1024);

	
var Priljubljene = persistence.define('Priljubljene', {
	ime: "TEXT",
	koor: "TEXT",
	opis: "TEXT"
	
});

	
var Uporabniki = persistence.define('Uporabniki', {
	up_ime: "TEXT",
	koor: "TEXT",
	skupina: "TEXT",
	cas_zadnjega_premika: "DATE"
	
});


persistence.schemaSync(function(tx) { 
  // tx is the transaction object of the transaction that was
  // automatically started
  console.log("Baza uspešno ustvarjena!");
  preveriLogin();
});
	 



