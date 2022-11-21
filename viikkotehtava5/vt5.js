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
function drawPath(param){

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



} 

/* Plään --> Rastien id --> idn perusteella lat ja lon --> piirretään polku */

function getLatLon(id){

    for(let i = 0; i < rastitTaulukko.length;i++){
        if(id === rastitTaulukko[i].id){
            rastitLatLon.push([rastitTaulukko[i].lat, rastitTaulukko[i].lon]);
            return rastitLatLon;
        }
    }
    rastitLatLon = [];
}


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



let items = document.querySelectorAll('.item');
let ul = document.getElementById("list");
let columns = document.querySelectorAll('.container1');

let dragItem = null;


items.forEach(item => {
    item.addEventListener('dragstart', dragStart);
    item.addEventListener('dragend', dragEnd);
    item.addEventListener('drop', dragDrop);
});

function dragStart() {
    console.log('drag started');
    dragItem = this;
    e.dataTransfer.setData("text/plain", items.getAttribute("id"));
}

function dragEnd() {
    console.log('drag ended');
    this.className = 'item';
    this.parentNode.removeChild(this);
    ul.appendChild(dragItem);
    dragItem = null;
}

function dragDrop() {
    e.preventDefault();
   // console.log('drag dropped');
   // this.append(dragItem);
   let data = e.dataTransfer.getData("text/plain");
   e.target.appendChild(document.getElementById(data));
    drawPath(e.target);
    
} 

columns.forEach(column => {
    column.addEventListener('dragover', dragOver);
    column.addEventListener('dragenter', dragEnter);
    column.addEventListener('dragleave', dragLeave);
    //column.addEventListener('drop', dragDrop);
});


function dragOver() {
    e.preventDefault();
    console.log('drag over');
}
function dragEnter() {
    console.log('drag entered');
}
function dragLeave() {
    console.log('drag left');
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
    }
    div1.appendChild(ul);
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
	
	/* Käydään rastit läpi ja lisätään listaukseen */
    for(let i = 0; i < rastitTaulukko.length; i++){

        let id = rastitTaulukko[i]["koodi"];
              
        /* Luodaan li -elementti */
        let li = document.createElement("li");
        li.style.backgroundColor = rainbow(rastitTaulukko.length,i);
        
        li.setAttribute("id", id);
        li.setAttribute("class", "item");
        li.setAttribute("draggable","true");
        li.appendChild(document.createTextNode(rastitTaulukko[i]["koodi"]));
        ul.appendChild(li);
    }
    div3.appendChild(ul);

}


/* function leimauksetDeep(){
            
    let joukkueet = joukkueTaulukko;
    for (let joukkue of joukkueet) {
        let rastiAttributes = {
            id: joukkue.getRastinId
        };
    	leimaukset.push(rastiAttributes);      
    }
    console.log("leimausket: ");
     console.log(leimaukset);
} */
            
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
* Apufunktio, joka vertailee joukkeuiden nimiä.
*
* @param {String} joukkue1
* @param {String} joukkue2
* @returns -1, 0 tai 1
*/
function compareRastit(rasti1, rasti2) {
            
    if (rasti1.koodi.toLowerCase() < rasti2.koodi.toLowerCase()) {
        return 1;
    }
    if (rasti1.koodi.toLowerCase() > rasti2.koodi.toLowerCase()) {
        return -1;
    }
    	return 0;
}



  
            
            



	    });
});
