"use strict";
// seuraavat estävät jshintin narinat leafletin objekteista
/* globals L */

// Alustetaan data, joka on jokaisella sivun latauskerralla erilainen.
window.addEventListener("load", function(e) {
	fetch('https://appro.mit.jyu.fi/cgi-bin/tiea2120/randomize_json.cgi')
	    .then(response => response.json())
	    .then(function(data) {
            console.log(data);
            
/* Määritetään taulukoita */
let joukkueTaulukko = [];
let rastitTaulukko = [];

/* Kutsutaan metodeja */
joukkueetDeep();
createTeamList();
createRastitList();

/* Luodaan maastokartta */
let map = new L.map('map', {
crs: L.TileLayer.MML.get3067Proj()
}).setView([62.118612, 25.628503], 10);
L.tileLayer.mml_wmts({ layer: "maastokartta", key : "3ad2a499-581c-4212-92d4-b1342b7a366d" }).addTo(map);

/* Piirretään ympyrät eli rastit*/
rastitTaulukko.forEach(function(coord) {
    let circle = L.circle(coord, {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 150
    }).addTo(map);
  });

/* Keskitetään kartta käyttäen fitboundsia
*  --> rastit näkyvät kartalla selainikkunan koonkin muuttuessa.
*  lat ja lon otettu pisimmän halkaisijan kohdalta rastien väliltä.
*/
map.fitBounds([[62.16435, 25.490042],[62.07737,  25.735731]]); 

/**
 * Funktiolla värjätään asioita.
 * 
 * @param {*} numOfSteps 
 * @param {*} step 
 * @returns 
 */
function rainbow(numOfSteps, step) {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    let r, g, b;
    let h = step / numOfSteps;
    let i = ~~(h * 6);
    let f = h * 6 - i;
    let q = 1 - f;
    switch(i % 6){
        case 0: r = 1; g = f; b = 0; break;
        case 1: r = q; g = 1; b = 0; break;
        case 2: r = 0; g = 1; b = f; break;
        case 3: r = 0; g = q; b = 1; break;
        case 4: r = f; g = 0; b = 1; break;
        case 5: r = 1; g = 0; b = q; break;
    }
    let c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
    return (c);
}

/* Asetetaan keskimmäiselle diville ominaisuuksia/tapahtumia, kuten
 * dragover ja drop
 */
const target = document.getElementById('targetDiv');

target.addEventListener("dragover", function(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move"; /* Move efekti --> item uuteen sijaintiin */
    });

/* Drop */
target.addEventListener('drop',(e) => {
    e.preventDefault();
    const sourceID = e.dataTransfer.getData('text/plain');

    let dropThis = document.getElementById(sourceID);
    dropThis.style.display = 'inline';
    let pasteWidth = dropThis.clientWidth;
    
    /* Ul -elementti */
    let ul = document.createElement('ul');
    ul.style.position = 'absolute';
    e.target.appendChild(ul);
    
    /* Elementin leveys ja korkeus %. */
    let targetWidth = ( e.offsetX / target.clientWidth ) * 100;
    let targetHeight = ( e.offsetY / target.clientHeight ) * 100;

    /* Muutetaan ul -elementin tyyliä, jotta saadaan keskitettyä
     * elementit raahatessa ne keskimmäiseen div/ul.
    */
	ul.style.width  = "" +  pasteWidth      +   "px";
	ul.style.top    = "" +  targetHeight    +   "%";
    ul.style.left   = "" +  targetWidth     +   "%";

	ul.appendChild(dropThis);

	let className = dropThis.getAttribute('class');

         if(className == 'item'){

            let trueName = teamNameLi(dropThis);
            
            let vari = dropThis.style.backgroundColor;
            let xyz = getLatLon(createPathArray(idLahto(data), idMaali(data), trueName, data), data);

            /* Polylinen piirto saaduiosta xy koordinaateista. */
            let polyline = L.polyline(xyz, {
                color: vari
            }).addTo(map);
                    
            dropThis.polyline = polyline; /* Tallennetaan toistaiseksi. */
         }
});

/**
 * Funktiolla järjestetään joukkueen rastit järjestykseen.
 * Lopulta palautetaan rastit taulukossa.
 * 
 * @param {String} lahtoId rastin lahto id
 * @param {String} maaliId rastin maali id
 * @param {Obejct} joukkue joukkue
 * @param {data} data
 * @returns taulukon, jossa rastit.
 */
function createPathArray(lahtoId, maaliId, joukkue, data){

	let start = [];
	let finish = [];
	let other = [];
    let combined = [];

        for (let leimaus of joukkue.rastileimaukset){
            
            if (leimaus.rasti == lahtoId){
                start.push(leimaus);	
            }
            if (leimaus.rasti == maaliId){
                finish.push(leimaus);
            }
            if ( leimaus.rasti !== lahtoId && leimaus.rasti !== maaliId ){
                other.push(leimaus);
            }
        }

    /* Jarjestetaan muodostuneet taulukot, jotta voidaan myöhemmin yhdistää */
    start.sort(compareRastitAika);
    finish.sort(compareRastitAika);
    other.sort(compareRastitAika);

    /* Tarkastetaan onko "LAHTO":ja useampia, jos on laitetaan niistä viimeinen taulukkoon. */
    if (start.length > 1){
        combined.push(start[start.length - 1]);
    }
    else {
        combined.push(...start);
    }
    combined.push(...other);
    combined.push(finish);

    let ready = [];

    for(let one of combined){
        ready.push(one.rasti);
    }

return ready;
}

/**
 * Funktiolla muodostetaan saadusta rastitaulukosta latLon taulukko.
 * Esim. latLonArray = [62.123, 25.123...]
 * 
 * @param {Array} array Taulukko
 * @param {data} data Tietorakenne
 * @returns lat-lon taulukon.
 */
function getLatLon(array){

    let latLonArray = [];
    let inProgress= [];

    for ( let i = 0; i < array.length; i++){
        for ( let rasti of rastitTaulukko){

            if( rasti.id == array[i]){

                /* Nollataan, ettei tule ylimääräisiä */
                inProgress= [];

                inProgress.push(rasti.lat);
                inProgress.push(rasti.lon);

                /* Tässä järjestyksessä, jotta saadaan rakenne; array = [ [ 65.123, 12,123], ...] 
                *  Jotta polylinen piirto osaa ottaa vastaan.
                */
                latLonArray.push(inProgress);
            }
        }
    }
return latLonArray;
}

/**
 * Funktio hakee joukkueen nimen, joka vastaa parametria.
 * 
 * @param {String} liName 
 * @returns Li nimen, joka vastaa joukkuetta
 */
function teamNameLi(liName){

    let nimi;
    for(let joukkue of joukkueTaulukko){
        if( joukkue.nimi == liName.innerText){
            nimi = joukkue;
            return nimi;
        }
    }
}

/**
* Funktiolla luodaan lista joukkueista.
*/
function createTeamList(){ 

/* Ensimmäinen div -elementti. */
  let div1 = document.getElementById("joukkueet");
                        
    /* Luodaan ul -elementti ja järjestetään taulukko*/
    let ul = document.createElement("ul");
    ul.setAttribute("id", "teamUL");
    joukkueTaulukko.sort(compareJoukkue);
            
    /* Käydään joukkueet läpi ja lisätään listaukseen */
    for(let i = 0; i < joukkueTaulukko.length;i++){

        let id = joukkueTaulukko[i]["nimi"];
              
        /* Luodaan li -elementti */
        let li = document.createElement("li");
        li.style.backgroundColor = rainbow(joukkueTaulukko.length,i);
        joukkueTaulukko[i].vari = li.style.backgroundColor;
        li.setAttribute("id", "" + id.replaceAll(" ", ""));
        li.setAttribute("class", "item");
        li.setAttribute("draggable","true");
        li.appendChild(document.createTextNode(joukkueTaulukko[i]["nimi"]));
        ul.appendChild(li);
        drag(li);
    }
    div1.appendChild(ul);

    let teamUL = document.getElementById("teamUL");

    /**
     * Lisätään li -elementille drag, dragover ja drop ominaisuudet.
     * Lisäksi piirretään viivat rastien välillä.
     * 
     * @param {li} li 
     */
    function drag(li){
        li.addEventListener("dragstart", function(e) {
            /* Elementin id-attribuutin arvo. */
			e.dataTransfer.setData("text/plain", li.getAttribute("id"));
		});	
    }

    /* Dragover */
    teamUL.addEventListener("dragover", function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move"; /* Move efekti */
    });

    /* Drop */
    teamUL.addEventListener("drop", function(e) {
        e.preventDefault();
        let ram = e.dataTransfer.getData("text/plain");
        let ramID = document.getElementById(ram);

        if ( ramID.getAttribute('class') == 'item' ){
            
            let teamUL = document.getElementById('teamUL');
            ramID.style.display = 'block';

            /* Viivojen poisto */
            let removePL = ramID.polyline;
            removePL.remove(map);
           
            teamUL.appendChild(document.getElementById(ram));
        }
    });
}

/**
 * Funktiolla luodaan lista rasteista.
 */
function createRastitList(){

    /* Kutsutaan metodia, joka luo rastitaulukon */
	rastitDeep();

	/* Kolmas div -elementti. */
    let div3 = document.getElementById("rastit");

	/* Luodaan ul -elementti */
	let ul = document.createElement("ul");
    ul.setAttribute("id", "rastitUL");
	
	/* Käydään rastit läpi ja lisätään listaukseen */
    for(let i = 0; i < rastitTaulukko.length; i++){

        let id = rastitTaulukko[i]["koodi"];
              
        /* Luodaan li -elementti */
        let li = document.createElement("li");
        li.style.backgroundColor = rainbow(rastitTaulukko.length,i);
        
        li.setAttribute("id", id);
        li.setAttribute("class", "item2");
        li.setAttribute("draggable","true");
        li.appendChild(document.createTextNode(rastitTaulukko[i]["koodi"]));
        ul.appendChild(li);
        drag(li);
    }
    div3.appendChild(ul);

    let rastitUL = document.getElementById("rastitUL");

    /**
     * Lisätään li -elementille drag, dragover ja drop ominaisuudet.
     * Lisäksi piirretään viivat rastien välillä.
     * 
     * @param {li} li 
     */
    function drag(li){
        li.addEventListener("dragstart", function(e) {
            /* Elementin id-attribuutin arvo. */
			e.dataTransfer.setData("text/plain", li.getAttribute("id"));
		});	
    }

    /* Dragover */
    rastitUL.addEventListener("dragover", function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move"; /* Move efekti */
    });

    /* Drop */
    rastitUL.addEventListener("drop", function(e) {
        e.preventDefault();
        let ram = e.dataTransfer.getData("text/plain");
        let ramID = document.getElementById(ram);

        if ( ramID.getAttribute('class') == 'item2' ){
            
            let rastitUL = document.getElementById('rastitUL');
            ramID.style.display = 'block';

            rastitUL.appendChild(document.getElementById(ram));
        }
    });
}
       
/**
* Funktiolla luodaan deepcopy taulukko alkuperäisestä data.joukkueet taulukosta.
*/
function joukkueetDeep(){
            
    let joukkueet = data.joukkueet;
    for (let joukkue of joukkueet) {
        let joukkueAttr = {
        aika: joukkue.aika,
        jasenet: joukkue.jasenet,
        leimaustapa: joukkue.leimaustapa,
        matka: joukkue.matka,
        nimi: joukkue.nimi,
        pisteet: joukkue.pisteet,
        rastileimaukset: joukkue.rastileimaukset,
        sarja: joukkue.sarja,   
        };
    	joukkueTaulukko.push(joukkueAttr);      
    }
}

/**
* Funktiolla luodaan deepcopy taulukko alkuperäisestä data.rastit taulukosta.
*/
function rastitDeep(){
            
    let rastit = data.rastit;
    for (let rasti of rastit) {
        let rastitAttributes = {
        id: rasti.id,
        koodi: rasti.koodi,
        lat: rasti.lat,
        lon: rasti.lon  
        };
    	rastitTaulukko.push(rastitAttributes);      
    }
	rastitTaulukko.sort(compareRastit);
}
             
/** 
* Apufunktio, joka vertailee joukkeuiden nimiä.
*
* @param {String} joukkue1
* @param {String} joukkue2
* @returns -1, 0 tai 1
*/
function compareJoukkue(joukkue1, joukkue2) {
            
    if (joukkue1.nimi.toLowerCase() < joukkue2.nimi.toLowerCase()) {
        return -1;
    }
    if (joukkue1.nimi.toLowerCase() > joukkue2.nimi.toLowerCase()) {
        return 1;
    }
    	return 0;
}

/** 
* Apufunktio, joka jarjestaa rastit käänteiseen järjestykseen.
*
* @param {String} rasti1
* @param {String} rasti2
* @returns -1, 0 tai 1
*/
function compareRastit(rasti1, rasti2) {
            
    if (rasti1.koodi.toLowerCase() > rasti2.koodi.toLowerCase()) {
        return -1;
    }
    if (rasti1.koodi.toLowerCase() < rasti2.koodi.toLowerCase()) {
        return 1;
    }
    	return 0;      
}

/** 
* Apufunktio, joka jarjestaa rastit ajan perusteella.
*
* @param {String} rasti1
* @param {String} rasti2
* @returns -1, 0 tai 1
*/
function compareRastitAika(rasti1, rasti2) {
            
    if (rasti1.aika.toLowerCase() < rasti2.aika.toLowerCase()) {
        return -1;
    }
    if (rasti1.aika.toLowerCase() > rasti2.aika.toLowerCase()) {
        return 1;
    }
    	return 0;      
}

/**
 * Apufunktio, joka palauttaa sen rastin ID:n, jolla on koodina "LAHTO".
 * 
 * @returns rastin koodilla "LAHTO" id.
 */
function idLahto(){

let lahtoID;
for (let rasti of rastitTaulukko){
    if(rasti.koodi == 'LAHTO'){
        lahtoID = rasti.id;
        return lahtoID;
    }
}
}

/**
 * Apufunktio, joka palauttaa sen rastin ID:n, jolla on koodina "MAALI".
 * 
 * @returns rastin koodilla "MAALI" id.
 */
 function idMaali(){
    let maaliID;
    for (let rasti of rastitTaulukko){
    
        if(rasti.koodi == 'MAALI'){
            maaliID = rasti.id;
            return maaliID;
        }
    }
    
    }
});
});