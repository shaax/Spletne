function dogodekObMirovanju(objekt, callback){

	//če nekdo že več kot 15s ni premaknil
	if(($.now() - objekt.cas_zadnjega_premika) > 25000){
		console.log("Oseba " + objekt.up_ime + " se ni premaknila že več kot 25 s!");
		console.log("CAS osebe " + objekt.up_ime + ": " + ($.now() - objekt.cas_zadnjega_premika));
		callback(objekt);
	}
                			
}


function randomLokacija(){

	var maxLong = 46.560;
	var minLong = 46.559;

	var maxLat = 15.640;
	var minLat = 15.635;

	var randomLong = Math.random()*(maxLong-minLong+1)+minLong;
	var randomLat = Math.random()*(maxLat-minLat+1)+minLat;
	var jaz = JSON.parse(localStorage.getItem("Uporabnik"));
	jaz.koor = randomLat + "," + randomLong;

	//shranimo v localstorage in hkrati v bazo
	localStorage.setItem("Uporabnik", JSON.stringify(jaz));

	

	posodobiSvojoLokacijo();

	
}


function posodobiSvojoLokacijo(){

	var jaz = JSON.parse(localStorage.getItem("Uporabnik"));
	var up_ime = jaz.up_ime;
	var lokacija = jaz.koor;

	//prikažemo svoje koordinate
	$('#koordinate').html(lokacija);

	console.log("POST UPDATE: " + JSON.stringify(jaz));
    $.post(server() + '/users/posodobiLokacijo', {'up_ime' : up_ime, 'koor' : lokacija}, function(result){
            console.log("Updatana lokacija: " + JSON.stringify(result));

            Uporabniki.findBy("up_ime", jaz.up_ime, function(r){

				r.koor = jaz.koor;
				r.cas_zadnjega_premika = $.now();
				persistence.add(r);
				persistence.flush();
			});
            posodobiLokacije();
            
    }).fail(function(){

        //alert("Ne morem do serverja!");
        dogodekObMirovanju(jaz, function(jaz){
        	$('#opozorilo').html("Nema servera!");
        });
    });

}

function posodobiLokacije(){

	var jaz = JSON.parse(localStorage.getItem("Uporabnik"));
	var skupina = jaz.skupina;
	$('#opozorilo').html();
    $.get(server() + '/skupine/'+ skupina, function(result){

            console.log("Podatki o uporabnikih: " + JSON.stringify(result));

            var array = null;
            if(result !== null){

                array = result.uporabniki;
                console.log("OBJEKT: " + JSON.stringify(array));
                array.forEach(function(objekt, iterator, all){

                	Uporabniki.findBy('up_ime', objekt.up_ime, function(rez){
                		//console.log("REZ: " + rez.koor + "    " + objekt.koor);
                		
                		//če oseba predolgo miruje, nas program obvesti
                		dogodekObMirovanju(objekt, function(objekt){
                			$('#opozorilo').html("Oseba " + objekt.up_ime + " se ni premaknila že več kot 25 s!");

                		});
       
            			rez.koor = objekt.koor;
            			
            			//če pridobimo svojo lokacijo, potem posodobimo tudi localstorage
            			if(jaz.up_ime === objekt.up_ime){
            				jaz.koor = objekt.koor;
            				localStorage.setItem("Uporabnik", JSON.stringify(jaz));
            			}
            				
            			persistence.add(rez);
            			persistence.flush();

            			if(iterator === all.length - 1)
            				pridobiLokacijeSkupine();
            		
                	});
                 });

            }
            
            
    }).fail(function(){

        //alert("Ne morem do serverja!");
    });

}