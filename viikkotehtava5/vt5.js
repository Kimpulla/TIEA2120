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
//rastitDeep();
createTeamList();
createRastitList();

/* Luodaan maastokartta */
let map = new L.map('map', {
crs: L.TileLayer.MML.get3067Proj()
}).setView([62.2333, 25.7333], 11);
L.tileLayer.mml_wmts({ layer: "maastokartta", key : "3ad2a499-581c-4212-92d4-b1342b7a366d" }).addTo(map);
            


/**
* Funktiolla luodaan lista joukkueista.
*/
// TODO: ei tarvi varmaan olla deepcopy, otetaan joukkueet suoraan datasta???
function createTeamList(){ 

/* Ensimmäinen forms -elementti. */
    let form = document.forms[0];
                        
    /* Luodaan ul -elementti ja järjestetään taulukko*/
    let ul = document.createElement("ul");
    joukkueTaulukko.sort(compareJoukkue);
            
    /* Käydään joukkueet läpi ja lisätään listaukseen */
    for(let i = 0; i < joukkueTaulukko.length;i++){
              
        /* Luodaan li -elementti */
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(joukkueTaulukko[i]["nimi"]));
        ul.appendChild(li);
    }
    form.appendChild(ul);
}

/**
 * Funktiolla luodaan lista rasteista.
 */
function createRastitList(){

	rastitDeep();

	/* Kolmas forms -elementti. */
    let form1 = document.forms[2];

	/* Luodaan ul -elementti */
	let ul = document.createElement("ul");
	
	/* Käydään rastit läpi ja lisätään listaukseen */
    for(let i = 0; i < rastitTaulukko.length; i++){
              
        /* Luodaan li -elementti */
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(rastitTaulukko[i]["koodi"]));
        ul.appendChild(li);
    }
    form1.appendChild(ul);
	
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
