//če uporabnik že obstaja, potem se prestavimo na glavno okno
//koordinate za google api
var coords = [];
var map, infowindow, marker, i;
var markersArray = [];
function server(){
    return 'http://192.168.0.128:3000';
}
function preveriLogin(){
    var uporabnik = localStorage.getItem("Uporabnik");
    console.log("UPORABNIK " + uporabnik);
    if(uporabnik !== null && uporabnik !== undefined && uporabnik !== ""){
        pomikNaGlavnoOkno();
        dolociPoslusalce();
    }
}
function login(){
    var input = $("#formPrijava").serializeArray();
    console.log("INPUT: " + JSON.stringify(input));
    var upime = input[0].value;
    var geslo = input[1].value;
    $.post(server() + '/login' , {'up_ime' : upime, 'geslo' : geslo}, function(result){
        console.log("REZULT POSTA: " + JSON.stringify(result));
        if(result !== null){
            if(result.skupine.length > 0){
                result.skupina = result.skupine[0].id;
                delete result.skupine;
                console.log("Za localstorage: " + JSON.stringify(result));
                localStorage.setItem("Uporabnik", JSON.stringify(result));
                shraniPodatkeUporabnikovSkupine(result.skupina);
                dolociPoslusalce();
                pomikNaGlavnoOkno();
                
            }
        }
    }).fail(function(){
        alert("Pa daj zapomni si svoje geslo!");
    });
    //če se uspešno izvede
    
}
function dolociPoslusalce(){
     //poslušalci za dinamično posodabljanje
    window.setInterval(randomLokacija, 10000);
    window.setInterval(renderirajClaniSkupine, 10000);
}
function pomikNaGlavnoOkno(){
     //ob uspešni prijavi renderiramo glavno okno in se prestavimo nanj
    renderirajGlavnoOkno(function(){   
        
          $.mobile.changePage( "#glavnoOkno", {
                allowSamePageTransition: true,
                transition: "slide"
            });             
    });
}
function shraniPodatkeUporabnikovSkupine(idSkupine){
    $.get(server() + '/skupine/'+ idSkupine, function(result){
            console.log("Podatki o uporabnikih: " + JSON.stringify(result));
            var array = null;
            if(result !== null){
                array = result.uporabniki;
                var upor = Uporabniki.all();
                upor.destroyAll(null, function() {
                    
                    array.forEach(function(objekt, iterator, all){
                            var u = {
                                'up_ime' : objekt.up_ime,
                                'koor' : objekt.koor,
                                'skupina': result.id,
                                'cas_zadnjega_premika' : objekt.cas_zadnjega_premika
                            };
                            var shrani = new Uporabniki(u);
                            persistence.add(shrani);
                            persistence.flush();
                     });
                });
            }
            
            
    }).fail(function(){
        alert("Ne morem do serverja!");
    });
}
function renderirajGlavnoOkno(callback){
    $.get('views/glavnoOkno.html', function(html){
        var template = Handlebars.compile(html);
        var upor = localStorage.getItem("Uporabnik");
        
        //za branje iz local storage je potrebno iz Stringa pridobiti javascript objekt z JSON.parse
        var podatki = {'koordinate' : JSON.parse(upor).koor};
        console.log(html);
        $('#koordinate').html(JSON.parse(upor).koor);
        var render = template(podatki);
       
        $('#map-canvas').append(render);
        callback();
    });
}
function renderirajClaniSkupine(){
    $.get('views/claniSkupine.html', function(html){
        var template = Handlebars.compile(html);
        pridobiClaneSkupine(function(vsi){
            console.log("VSI: " + JSON.stringify(vsi));
            //za branje iz local storage je potrebno iz Stringa pridobiti javascript objekt z JSON.parse     
            var render = template(vsi);
            $('#vsebinaClaniSkupine').html(render);
        });
 
    });
}
function pridobiClaneSkupine(callback){
    Uporabniki.all().list(function(r){
        console.log("Vsi clani: " + JSON.stringify(r));
        var jaz = JSON.parse(localStorage.getItem("Uporabnik"));
        var podatki = {};
        podatki.clani = [];
        r.forEach(function(objekt, iterator, vsi){
            //če ima objekt enako uporabniško ime kot trenutni user, potem ga shranimo kot JAZ
            if(objekt.up_ime === jaz.up_ime)
                podatki.jaz = objekt;
            else
                podatki.clani.push(objekt);
            if(iterator === vsi.length - 1){
                console.log("Podatki o clanih: " + JSON.stringify(podatki));
                callback(podatki);
            }
                
        });
        
    });
}
function pridobiLokacijeSkupine(){
    Uporabniki.all().list(function(r){
        var coordinates = [];
        console.log("Vsi clani: " + JSON.stringify(r));
        var jaz = JSON.parse(localStorage.getItem("Uporabnik"));
        var podatki = {};
        podatki.clani = [];
        r.forEach(function(objekt, iterator, vsi){
            var polje, split;
            //če ima objekt enako uporabniško ime kot trenutni user, potem ga shranimo kot JAZ
            if(objekt.up_ime === jaz.up_ime){
                 podatki.jaz = objekt;
                 polje = [];
                 polje[0] = objekt.up_ime;
                split = objekt.koor.split(',');      
                polje[1] = split[1];
                polje[2] = split[0];
                 
                 coordinates.push(polje);
            }
               
            else{
                 polje = [];
                 polje[0] = objekt.up_ime;
                 split = objekt.koor.split(',');
                
                polje[1] = split[1];
                polje[2] = split[0];
                coordinates.push(polje);
            }
                
            if(iterator === vsi.length - 1){
                console.log("LOKACIJE: " + JSON.stringify(coordinates));
                coords = coordinates;
                clearOverlays();
                
              iteracijaPrekoMarkerjev();
           
            }
                
        });
        
    });
}
function odjava(){
    localStorage.removeItem("Uporabnik");
    $.mobile.changePage( "index.html", {
                allowSamePageTransition: true,
                transition: "slide"
    });            
}
    var pageHeaderHTML = '<a href="#" data-rel="back" data-icon="back" data-rel="back" title="Go back" data-icon="arrow-l">Nazaj</a><a href="#" onclick="javascript:odjava()" data-role="button" data-theme="b" class="ui-btn-right">Odjava</a>';
    var pageHeaderHTMLnoBack = '<a href="#" onclick="javascript:odjava()" data-role="button" data-theme="b" class="ui-btn-right">Odjava</a>';
    $( "div#pageHeader" ).each(function() {
        $( this ).append(pageHeaderHTML);
      });
    $( "div#pageHeaderNoBack" ).each(function() {
        $( this ).append(pageHeaderHTMLnoBack);
    });
function clearOverlays() {
  if (markersArray) {
    for (i in markersArray) {
      markersArray[i].setMap(null);
    }
  }
}
function iteracijaPrekoMarkerjev(){
        for (i = 0; i < coords.length; i++) {  
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(coords[i][1], coords[i][2]),
            map: map
          });
          markersArray.push(marker);
      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(coords[i][0]);
          infowindow.open(map, marker);
        }
      })(marker, i));
    }
}
function initialize() {
        
       
        var location = new google.maps.LatLng(46.559425, 15.639235);
        var mapCanvas = document.getElementById('map-canvas');
        var mapOptions = {
          center: location,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(mapCanvas, mapOptions);
      
        infowindow = new google.maps.InfoWindow();
        
        iteracijaPrekoMarkerjev();
        
    // iterate over your coords array
        
   
        
      }
      google.maps.event.addDomListener(window, 'load', initialize);
      
       //google.maps.event.addDomListener(window, 'load', initialize);