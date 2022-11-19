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

/* Kutsutaan metodeja */
joukkueetDeep();
createTeamList();

/* Luodaan maastokartta */
let map = new L.map('map', {
crs: L.TileLayer.MML.get3067Proj()
}).setView([62.2333, 25.7333], 11);
L.tileLayer.mml_wmts({ layer: "maastokartta", key : "3ad2a499-581c-4212-92d4-b1342b7a366d" }).addTo(map);
            


/**
* Funktiolla luodaan lista joukkueista.
*/
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
            
            



	    });
});
