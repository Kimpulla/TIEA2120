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
let rastitLatLon= [];
let leimaukset = [];

/* Kutsutaan metodeja */
joukkueetDeep();
createTeamList();
createRastitList();


/* Luodaan maastokartta */
let map = new L.map('map', {
crs: L.TileLayer.MML.get3067Proj()
}).setView([62.118612, 25.628503], 7.7);
L.tileLayer.mml_wmts({ layer: "maastokartta", key : "3ad2a499-581c-4212-92d4-b1342b7a366d" }).addTo(map);



/* Piirretään ympyrät */
rastitTaulukko.forEach(function(coord) {
    let circle = L.circle(coord, {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 150
    }).addTo(map);
  });

/* /* Piirretään reitti */
/* function drawPath(param){

let pointlist = [];
let rastinId = [];

for(let joukkue of joukkueTaulukko){
    
    for(let leimaus of joukkue.rastileimaukset){

        if(leimaus.rasti != "" && leimaus.rasti != undefined){
            // Lista joukkueen rastien koordinaateista 
            rastinId = getRastinId(leimaus.rasti);
            pointlist.push(rastinId);
            console.log("pointlist");
            console.log(pointlist);
            
        }
    }
    let polyline = new L.Polyline(pointlist, {
        color: joukkue.vari,
        weight: 3,
        opacity: 0.5,
        smoothFactor: 1
    });
    polyline.addTo(map);
    pointlist = [];
}



}   */

/* Plään --> Rastien id --> idn perusteella lat ja lon --> piirretään polku */

/* function getLatLon(id){

    for(let i = 0; i < rastitTaulukko.length;i++){
        if(id === rastitTaulukko[i].id){
            rastitLatLon.push([rastitTaulukko[i].lat, rastitTaulukko[i].lon]);
            return rastitLatLon;
        }
    }
    rastitLatLon = [];
}
 */

/* Joukkueen rastin id */
function getRastinId(rastileimaus){

    let array = [];

    for(let rasti of data.rastit){

        if(rasti.id == rastileimaus){
            array.push(rasti.lat,rasti.lon);      
            return array;
        }
    }
}

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

/* Asetetaan keskimmiselle diville ominaisuuksia, kuten
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
    
    let ul = document.createElement('ul');
    ul.style.position = 'absolute';
    e.target.appendChild(ul);
    
    let targetWidth = ( e.offsetX / target.clientWidth ) * 100;
    let targetHeight = ( e.offsetY / target.clientHeight ) * 100;


	ul.style.width = "" + pasteWidth + "px";
	ul.style.top = "" + targetHeight+ "%";
    ul.style.left = "" +  targetWidth + "%";

	ul.appendChild(dropThis);

	let className = dropThis.getAttribute('class');

         if(className == 'item'){

            let trueName = teamNameLi(dropThis);
            
            let vari = dropThis.style.backgroundColor;
            let xyz = getLatLon(createPathArray(idLahto(data), idMaali(data), trueName, data), data);

            let polyline = L.polyline(xyz, {
                color: vari
            }).addTo(map);
                    
            dropThis.polyline = polyline;
         }
});


/**
 * Funktiolla järjestetään joukkueen rastit järjestykseen.
 * Lopulta palautetaan rastit taulukossa.
 * 
 * @param {String} lahtoId 
 * @param {String} maaliId 
 * @param {Obejct} joukkue
 * @param {data} data
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
        console.log(combined);
    }
    else {
        combined.push(...start);
        console.log(combined);
    }

    combined.push(...other);
    combined.push(finish);

    console.log("combined array");
    console.log(combined);

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
function getLatLon(array, data){

    let latLonArray = [];
    let inProgress= [];

    for ( let i = 0; i < array.length; i++){ //TODO: EHKÄ DATA POIS?
        for ( let rasti of data.rastit){

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
// TODO: ei tarvi varmaan olla deepcopy, otetaan joukkueet suoraan datasta???
function createTeamList(){ 

/* Ensimmäinen forms -elementti. */
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
        li.setAttribute("id", id);
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
            
            let teamUL = document.getElementById('joukkueul');
            ramID.style.display = 'block';

            /* Viivojen poisto */
            let polylineulos = ramID.polyline;
            polylineulos.remove(map);
           
            teamUL.appendChild(document.getElementById(ram));
        }
    
        });

}

/**
 * Funktiolla luodaan lista rasteista.
 */
function createRastitList(){

	rastitDeep();

	/* Kolmas forms -elementti. */
    //let form1 = document.forms[1];
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
    }
    div3.appendChild(ul);

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
    console.log("JoukkueTaulukko: ");
     console.log(joukkueTaulukko);
}


/**
* Funktiolla luodaan deepcopy taulukko alkuperäisestä data.rastit taulukosta.
*TODO: RASTIT KÄÄNTEISEEN AAKKOSJ
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
    console.log("rastitTaulukko: ");
     console.log(rastitTaulukko);
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
* Apufunktio, joka jarjestaa rastit.
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