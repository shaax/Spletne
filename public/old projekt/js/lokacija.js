function dogodekObMirovanju(){


}


function randomLokacija(){

	var random = Math.random();
	var jaz = JSON.parse(localStorage.getItem("Uporabnik"));
	jaz.koor = random;
	localStorage.setItem("Uporabnik", JSON.stringify(jaz));
}


function posodobiSvojoLokacijo(){

	var jaz = JSON.parse(localStorage.getItem("Uporabnik"));

	var up_ime = jaz.up_ime;
	var lokacija = jaz.koor;

	console.log("POST UPDATE: " + JSON.stringify(jaz));
    $.post(server() + '/users/posodobiLokacijo', {'up_ime' : up_ime, 'koor' : lokacija}, function(result){

            console.log("Updatana lokacija: " + JSON.stringify(result));

            //lokalni update za lokacijo
            Uporabniki.findBy("up_ime", up_ime, function(rez){

            	rez.koor = lokacija;
            	rez.cas_zadnjega_premika = result;
            	persistence.add(rez);
            	persistence.flush();

            	//jaz.koor = lokacija;
            	jaz.cas_zadnjega_premika = Date.parse(result);
            	localStorage.setItem("Uporabnik", JSON.stringify(jaz));

            });
            
    }).fail(function(){

        //alert("Ne morem do serverja!");
    });

}

function posodobiLokacije(){

	var jaz = JSON.parse(localStorage.getItem("Uporabnik"));
	var skupina = jaz.skupina;

	var casi = [];
    $.get(server() + '/skupine/'+ skupina, function(result){

            console.log("Podatki o uporabnikih: " + JSON.stringify(result));

            var array = null;
            if(result !== null){

                array = result.uporabniki;
                
                array.forEach(function(objekt, iterator, all){

                	Uporabniki.findBy('up_ime', objekt.up_ime, function(rez){
                		console.log("REZ: " + rez.koor + "    " + objekt.koor);
                		

                		//če nekdo že več kot 15s ni premaknil
                		if(($.now() - objekt.cas_zadnjega_premika) > 25000){
                			$('#opozorilo').html("Oseba " + objekt.up_ime + " se ni premaknila že več kot 15 s!");
                			console.log("Oseba " + objekt.up_ime + " se ni premaknila že več kot 15 s!");
                			console.log("CAS osebe " + objekt.up_ime + ": " + ($.now() - objekt.cas_zadnjega_premika));
                		}
                			
                		
                		//console.log("RAZLIKA ČASOV: " + ($.now() - objekt.cas_zadnjega_premika));
                		//casi.push({'up_ime' : objekt.koor});
                		//rez.cas_zadnjega_premika = $.now();
                		//console.log("TIMESTAMP: " + new Date(rez.cas_zadnjega_premika*1000));
                			

            			rez.koor = objekt.koor;
            			
            			//če pridobimo svojo lokacijo, potem posodobimo tudi localstorage
            			if(jaz.up_ime === objekt.up_ime){
            				jaz.koor = objekt.koor;
            				localStorage.setItem("Uporabnik", JSON.stringify(jaz));
            			}
            				
            			persistence.add(rez);
            			persistence.flush();
            			console.log("CASI " + JSON.stringify(casi));
    					localStorage.setItem("spremembe_lokacije", JSON.stringify(casi));
                	});
                 });

            }
            
            
    }).fail(function(){

        //alert("Ne morem do serverja!");
    });

}