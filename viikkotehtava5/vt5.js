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

/* Kutsutaan metodeja */
joukkueetDeep();
//rastitDeep();
createTeamList();
createRastitList();


/* Luodaan maastokartta */
let map = new L.map('map', {
crs: L.TileLayer.MML.get3067Proj()
}).setView([62.118612, 25.628503], 10);
L.tileLayer.mml_wmts({ layer: "maastokartta", key : "3ad2a499-581c-4212-92d4-b1342b7a366d" }).addTo(map);



/* Piirretään ympyrät */
rastitTaulukko.forEach(function(coord) {
    let circle = L.circle(coord, {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 50
    }).addTo(map);
  });

/* Piirretään reitti */
//drawPath();

function drawPath(){

for(let joukkue of joukkueTaulukko){

    let polygon = L.polygon([
    getLatLon(getRastinId)
    ]).addTo(map);
}

}

console.log( getLatLon(getRastinId));

/* Plään --> Rastien id --> idn perusteella lat ja lon --> piirretään polku */

/* function getLatLon(id){

    for(let i = 0; i < rastitTaulukko.length;i++){
        if(id === rastitTaulukko[i]["id"]){
            rastitLatLon.push([rastitTaulukko[i]["lat"], rastitTaulukko[i]["lon"]]);
            return rastitLatLon;
        }
    }
    rastitLatLon = [];
}
 */

/* Joukkueen rastin id */
function getRastinId(){

    let id;
    for(let i = 0; i < joukkueTaulukko.length; i++){
        id = joukkueTaulukko[i].rastileimaukset[i]["rasti"];
        console.log(id);
        return id;
    }
}




let items = document.querySelectorAll('.item');
let ul = document.getElementById("list");
let columns = document.querySelectorAll('.container1');

let dragItem = null;


items.forEach(item => {
    item.addEventListener('dragstart', dragStart);
    item.addEventListener('dragend', dragEnd);
});

function dragStart() {
    console.log('drag started');
    dragItem = this;
    //setTimeout(() => this.className = 'invisible', 0);
}
function dragEnd() {
    console.log('drag ended');
    this.className = 'item';
    this.parentNode.removeChild(this);
    ul.appendChild(dragItem);
    dragItem = null;
    drawPath();
    
}

columns.forEach(column => {
    column.addEventListener('dragover', dragOver);
    column.addEventListener('dragenter', dragEnter);
    column.addEventListener('dragleave', dragLeave);
    column.addEventListener('drop', dragDrop);
});

            if( rasti.id == array[i]){

                latLonArray.push(rasti.lat);
                latLonArray.push(rasti.lon);
            }
        }
    }
return latLonArray;
}
function dragEnter() {
    console.log('drag entered');
}
function dragLeave() {
    console.log('drag left');
}
function dragDrop() {
    e.preventDefault();
    console.log('drag dropped');
    this.append(dragItem);
}

/**
* Funktiolla luodaan lista joukkueista.
*/
// TODO: ei tarvi varmaan olla deepcopy, otetaan joukkueet suoraan datasta???
function createTeamList(){ 

/* Ensimmäinen forms -elementti. */
  //  let form = document.forms[0];
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
     * Raahauksen aloitus.
     * 
     * @param {li} li 
     */
    function drag(li){
        li.addEventListener("dragstart", function(e) {
			e.dataTransfer.setData("text/plain", li.getAttribute("id"));
		});	
    }

    /* Dragover */
    teamUL.addEventListener("dragover", function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    });

    /* Drop */
    teamUL.addEventListener("drop", function(e) {
        e.preventDefault();
        let ram = e.dataTransfer.getData("text/plain");
        let ramID = document.getElementById(ram);

 
        if ( ramID.getAttribute('class') == 'item' ){
            

            let teamUL2 = document.getElementById('joukkueul');
            ramID.style.display = 'block';

            /* Viivojen poisto */
            let polylineulos = ramID.polyline;
            polylineulos.remove(map);
           
            teamUL2.appendChild(document.getElementById(ram));
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
    //ul.setAttribute("class", "target");
	
	/* Käydään rastit läpi ja lisätään listaukseen */
    for(let i = 0; i < rastitTaulukko.length; i++){

        let id = rastitTaulukko[i]["koodi"];
              
        /* Luodaan li -elementti */
        let li = document.createElement("li");
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