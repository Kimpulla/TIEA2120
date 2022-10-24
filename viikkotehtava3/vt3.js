"use strict";  // pidä tämä ensimmäisenä rivinä
//@ts-check

// Alustetaan data, joka on jokaisella sivun latauskerralla erilainen.
// tallennetaan data selaimen localStorageen, josta sitä käytetään seuraavilla
// sivun latauskerroilla. Datan voi resetoida lisäämällä sivun osoitteeseen
// ?reset=1
// jolloin uusi data ladataan palvelimelta
// Tätä saa tarvittaessa lisäviritellä
function alustus() {
     // luetaan sivun osoitteesta mahdollinen reset-parametri
     // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
     const params = new window.URLSearchParams(window.location.search);
     let reset = params.get("reset");
     let data;
     if ( !reset  ) {
       try {
          // luetaan vanha data localStoragesta ja muutetaan merkkijonosta tietorakenteeksi
          // https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
          data = JSON.parse(localStorage.getItem("TIEA2120-vt3-2022s"));
       }
       catch(e) {
         console.log("vanhaa dataa ei ole tallennettu tai tallennusrakenne on rikki", data, e);
       }
       if (data) {
               console.log("Käytetään vanhaa dataa");
	       start( data );
               return;
           }
     }
     // poistetaan sivun osoitteesta ?reset=1, jotta ei koko ajan lataa uutta dataa
     // manipuloidaan samalla selaimen selainhistoriaa
     // https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
     history.pushState({"foo":"bar"}, "VT3", window.location.href.replace("?reset="+reset, ""));
     // ladataan asynkronisesti uusi, jos reset =! null tai tallennettua dataa ei ole
     // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
	fetch('https://appro.mit.jyu.fi/cgi-bin/tiea2120/randomize_json.cgi')
	    .then(response => response.json())
	    .then(function(data) {
               console.log("Ladattiin uusi data", data);
               // tallennetaan data localStorageen. Täytyy muuttaa merkkijonoksi
	       // https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem
	       localStorage.setItem("TIEA2120-vt3-2022s", JSON.stringify(data));
 	       start( data );
	    }
  	    );
}

// oma sovelluskoodi voidaan sijoittaa tähän funktioon
function start(data) {

 // Luodaan globaalit taulukot:
 let sarjaTaulukko = [];
 let joukkueTaulukko = [];
 let jasenetTaulukko = [];
 let sarjaIdJaNimi = [];
 let leimaustavat = [];


 // Kutsutaan funktioita:
 joukkueetDeep(); 
 lisaaRadioBox();
 lisaaCheckBox();
 luoSarjaT();
 luoSarjanNimiJaId();

 // Lisätään lista joukkueista.
 document.getElementById("lista").appendChild(createJoukkueetList(joukkueTaulukko[0]));
 createJoukkueetList(joukkueTaulukko.set0);       



  console.log(data);
  // tallenna data sen mahdollisten muutosten jälkeen aina localStorageen. 
  // localStorage.setItem("TIEA2120-vt3-2022s", JSON.stringify(data));
  // kts ylempää mallia
  // varmista, että sovellus toimii oikein omien tallennusten jälkeenkin
  // eli näyttää sivun uudelleen lataamisen jälkeen edelliset lisäykset ja muutokset
  // resetoi rakenne tarvittaessa lisäämällä sivun osoitteen perään ?reset=1
  // esim. http://users.jyu.fi/~omatunnus/TIEA2120/vt2/pohja.xhtml?reset=1



/**
 * Funktiolla lisaaRadioBox luodaan radiobox -ja niiden label -elementit.
 */
function lisaaRadioBox(){

  // Etsii div elementint id:n perusteella.
  let boxit = document.getElementById("boxes");

  let sarjat = data.sarjat;

  // Käydään datan sarjat läpi ja luodaan radioboxit + labelit.
  for(let sarja of sarjat){

    // Luodaan label ja tarvittavat attribuutit.
    let label = document.createElement("label");
    label.className = "oikea";
    label.appendChild(document.createTextNode(sarja.nimi));
    
    boxit.appendChild(label);

    // Luodaan radiobuttonit ja tarvittavat attribuutit.
    let cbox = document.createElement("input");
    cbox.type = "radio";
    cbox.name = "rg";
    cbox.id = sarja.nimi; // TODO : muuttaa ettei valtia ctr + alt + v=?
    cbox.checked = true; // Tällöin viimeinen on aina checked.


    label.htmlFor = cbox.id;

    label.appendChild(cbox);

    // Luodaan väli.
    let breik = document.createElement("br");
    boxit.appendChild(breik);
  }
}

/**
 * Funktiolla lisaaCheckBox luodaan radiobox -ja niiden label -elementit.
 */
 function lisaaCheckBox(){

  // Etsii div elementint id:n perusteella.
  let boxit = document.getElementById("cboxes");

  let leimaustavat = data.leimaustavat;

  // Käydään datan leimasutavat läpi ja luodaan checkboxit + labelit.
  for(let leimaus of leimaustavat){

    // Luodaan label ja tarvittavat attribuutit.
    let label = document.createElement("label");
    label.className = "oikea2";
    label.appendChild(document.createTextNode(leimaus));
    
    boxit.appendChild(label);

    // Luodaan checkboxit ja tarvittavat attribuutit.
    let cbox = document.createElement("input");
    cbox.type = "checkbox";
    cbox.name = "cb";
    cbox.id = leimaus; // TODO : muuttaa ettei valtia ctr + alt + v=?
    //cbox.checked = true;  // Tällöin viimeinen on aina checked.


    label.htmlFor = cbox.id;

    label.appendChild(cbox);

    // Luodaan väli.
    let breik = document.createElement("br");
    boxit.appendChild(breik);
  }
  
}



// Valitsee ensimmäisen form -elementin.
let form = document.forms["lomake"];

/**
 * Asetetaan lisaa napin toimivuus, mahdollistetaan joukkueiden lisääminen
 * tietokantaan.
 */
 form.addEventListener("submit", function (e) {
               
  e.preventDefault(); // estetään lomakkeen lähettäminen

  // Etsitään nimi -input elementin sijainti.
  let jnimi = document.forms.lomake[1];
  console.log("Joukkueen nimi: ", jnimi.value);

  
  let sarjanId;
  // Etsitään valittu radiobox ja tämän sarjan id.
  for (let sarja of data.sarjat){
     if(document.getElementById(sarja.nimi).checked == true){
      sarjanId = sarja.id;
     }
  }
  console.log("Joukkueen sarjan id: ", sarjanId);

  // Etsitään jäsen 1 -input elementin sijainti.
  let jasen1 = document.getElementById("jasen1");
  console.log("Joukkueen jasen 1: ", jasen1.value);
 
  // Etsitään jäsen 2 -input elementin sijainti.
  //let jasen2 = document.getElementById("jasen2");
  //console.log("Joukkueen jasen 2: ", jasen2.value);

  //Etsitään checkbox lementtien sijainti
  let cbox = document.getElementsByName("cb");
  console.log("checkboxit: ", cbox.value);

  // Näiden avulla lisätään tai ei lisätä joukkuetta. Käytännössä true, false.
  let judgement;
  let nimiJudgement;
  let pituusJudgement;

  /* Tästä alkaa validoinnit */

    // Joukkueen nimen validointi.
  if(jnimi.value.trim().length < 2){
    jnimi.setCustomValidity("Nimen oltava vähintään 2 merkkiä!");
    jnimi.reportValidity();
    nimiJudgement = -1;
  }
  else{
    jnimi.setCustomValidity("");
    jnimi.reportValidity();
    nimiJudgement = 1;
  }
  jnimi.setCustomValidity("");
  jnimi.reportValidity();

   for ( let joukkue of joukkueTaulukko){

    if(jnimi.value.trim() == joukkue.nimi.toLowerCase()){
      jnimi.setCustomValidity("Joukkue on jo olemassa!");
      jasen1.reportValidity();
      pituusJudgement = -1;
    } 
    else{
      jnimi.setCustomValidity("");
      jnimi.reportValidity();
      pituusJudgement = 1;
    }
      jnimi.setCustomValidity("");
      jnimi.reportValidity();
  } 

  // Jasenien validointi.
  if ((jasen1.value.trim() == "") /*&& (jasen2.value.trim() == "") */) {
    jasen1.setCustomValidity("Oltava vähintään kaksi jäsentä!");
    jasen1.reportValidity();
    judgement = -1;
  } else {
    jasen1.setCustomValidity("");
    jasen1.reportValidity();
    judgement = 1;
  }
    jasen1.setCustomValidity("");
    jasen1.reportValidity(); 

  // Leimaustavan validointi.
  if(getLeimaustapa(cbox).length == 0){
    document.getElementById("NFC").setCustomValidity("Leimaustapaa ei ole valittu");
    document.getElementById("NFC").reportValidity();
    judgement = -1;
  }else {
    document.getElementById("NFC").setCustomValidity("");
    document.getElementById("NFC").reportValidity();
    judgement = 1;
  }
    document.getElementById("NFC").setCustomValidity("");
    document.getElementById("NFC").reportValidity();
  

  // Jos judgementit sen sallii, luodaan uusi joukkue.  
  if (judgement == 1 && nimiJudgement == 1 && pituusJudgement == 1){
    uusiJoukkue(jnimi.value,sarjanId,jasen1.value,jasen2.value,getLeimaustapa(cbox));
  }
 

  paivitaJoukkueet();
  localStorage.setItem("TIEA2120-vt3-2022s", JSON.stringify(data)); // Tallennetaan localstorageen.
  form.reset(); 

  // Etsitään radiobuttonit.
  let boxes = document.getElementById("boxes");
  boxes.textContent = "";  // poistetaan radiobuttonit.

  lisaaRadioBox();  // Luodaan ne uudestaan => alkuperäinen tilanne.
  

  console.log(data.joukkueet);
});









    // dynaaminen lista koko sivun input-elementeistä
    // voisi käyttää myös omaa taulukkoa tms.
    let inputit = document.getElementsByClassName("attr");
    inputit[0].addEventListener("input", addNew); //ok

    function addNew(e) {
        // käydään läpi kaikki input-kentät viimeisestä ensimmäiseen
        // järjestys on oltava tämä, koska kenttiä mahdollisesti poistetaan
        // ja poistaminen sotkee dynaamisen nodeList-objektin indeksoinnin
        // ellei poisteta lopusta 
        let viimeinen_tyhja = -1; // viimeisen tyhjän kentän paikka listassa
        for(let i=inputit.length-1 ; i>-1; i--) { // inputit näkyy ulommasta funktiosta
            let input = inputit[i];
            // jos on jo löydetty tyhjä kenttä ja löydetään uusi niin poistetaan viimeinen tyhjä kenttä
            // kenttä on aina label-elementin sisällä eli oikeasti poistetaan label ja samalla sen sisältö
            // <form id="lomake" action="ei toimi">
            //<label>Kenttä <input type="text" value="" /></label>
            //<label>Kenttä <input type="text" value="" /></label>
            //<label>Kenttä <input type="text" value="" /></label>
            //<label>Kenttä <input type="text" value="" /></label>
            // </form>
            if ( viimeinen_tyhja > -1 && input.value.trim() == "") { // ei kelpuuteta pelkkiä välilyöntejä
                let poistettava = inputit[viimeinen_tyhja].parentNode; // parentNode on label, joka sisältää inputin
                document.forms[0].removeChild( poistettava );
                viimeinen_tyhja = i;
            }
            // ei ole vielä löydetty yhtään tyhjää joten otetaan ensimmäinen tyhjä talteen
            if ( viimeinen_tyhja == -1 && input.value.trim() == "") {
                    viimeinen_tyhja = i;
            }
        }
        // ei ollut tyhjiä kenttiä joten lisätään yksi
        if ( viimeinen_tyhja == -1) {
            let label = document.createElement("label");
            label.textContent = "Kenttä";
            let input = document.createElement("input");
            input.setAttribute("type", "text");
            input.addEventListener("input", addNew)
            document.forms[0].appendChild(label).appendChild(input);
        }
        // jos halutaan kenttiin numerointi
        for(let i=0; i<inputit.length; i++) { // inputit näkyy ulommasta funktiosta
                let label = inputit[i].parentNode;
                label.firstChild.nodeValue = "Kenttä " + (i+1); // päivitetään labelin ekan lapsen eli tekstin sisältö
        }
    
    }







/**
 * Etsitään valittu leimaustapa tarkastamalla onko valittu checkbox aktivoitu,
 * jos on laitetaan leimaustavan indeksi leimaustavat taulukkoon.
 * 
 * @param {Array} array 
 * @returns leimaustavat taulukko.
 */
function getLeimaustapa(array){

  // Nollataan taulukko.
  leimaustavat = [];

 for(let i = 0; i < array.length;i++){
  if(array[i].checked == true){
    leimaustavat.push(i.toString());
  }
}
return leimaustavat;
}

// yritetään validoia joukkueen nimi
 function validoiJoukkueenNimi(input){

for ( let joukkue of joukkueTaulukko){
  if(input.value.trim().length < 2){
    input.setCustomValidity("Nimen oltava vähintään 2 merkkiä!");
    return false;
    
  }
  else if(input.value.trim() == joukkue.nimi.toLowerCase()){
    input.setCustomValidity("Joukkue on jo olemassa!");
    return false;
    
  }
  else{
    input.setCustomValidity("");
    input.reportValidity();
    return true;
  }
}

}
 


/**
 * Luodaan uusi joukkue.
 * 
 * @param {*} nimi 
 * @param {*} sarja 
 * @param {*} jasen1 
 * @param {*} jasen2 
 */
function uusiJoukkue(nimi,sarja,jasen1,jasen2,cbox){

  // Nollataan jasenetTaulukko.
  jasenetTaulukko = [];

  luoJasenetT(jasen1,jasen2);

  let newTeam = {
    aika: "00:00:00",
    jasenet: jasenetTaulukko,
    leimaustapa: cbox,
    matka: 0,
    nimi: nimi,
    pisteet: 0,
    rastileimaukset: [],
    sarja: sarja,
    
  };
  data.joukkueet.push(newTeam);

}

/**
 * Funktio luoJasenetT täyttää jasenetTaulukon uusilla jasenilla,
 * joka sitten myöhemmin tarvitaan uuden joukkueen lisäämisessä ( funktio uusiJoukkue ).
 * 
 * @param {String} jasen1 
 * @param {String} jasen2 
 */
function luoJasenetT(jasen1,jasen2){
  
  jasenetTaulukko.push(jasen1,jasen2);

  if(jasen1 == ""){
     let index = jasenetTaulukko.indexOf(jasen1);
     jasenetTaulukko.splice(index,1);
  }
  if(jasen2 == ""){
    let index2 = jasenetTaulukko.indexOf(jasen2);
    jasenetTaulukko.splice(index2,1);
  }
  
}

/**
 * Luodaan sarjaTaulukko.
 * 
 * @param {String} alkuaika 
 * @param {String} id
 * @param {String} kesto 
 * @param {String} loppuaika
 * @param {String} nimi
 */
 function luoSarjaT(){

  for (let sarja of data.sarjat){
    let uusiSarja = {
      alkuaika: sarja.alkuaika,
      id: sarja.id,
      kesto:sarja.kesto,
      loppuaika: sarja.loppuaika,
      nimi: sarja.nimi
    
    };
  sarjaTaulukko.push(uusiSarja);
  }
  console.log("SarjaTaulukko ei sortattu: ");
  console.log(sarjaTaulukko);

  console.log("SarjaTaulukko sortattu: ");
  sarjaTaulukko.sort(compareName);
  console.log(sarjaTaulukko);
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


function luoSarjanNimiJaId(){

  let sarjat = data.sarjat;
  for( let sarja of sarjat){

  let uusiSarja = {
    id: sarja.id,
    nimi: sarja.nimi
  
  };
  sarjaIdJaNimi.push(uusiSarja);
}
console.log("sarja id ja nimi");
console.log(sarjaIdJaNimi);
}



/**
 * Funktiolla createJoukkueetList luodaan ul ja li elementit joukkueille.
 * 
 * @returns listan.
 */
 function createJoukkueetList() {

  // Luodaan ul -elementti.
  let list = document.createElement("ul");

  joukkueTaulukko.sort(compareJoukkue);  // Järjestetään joukkueen nimet aakkosjärjestykseen.

  for(let i = 0; i < joukkueTaulukko.length;i++){  // Järjestetään jäsenet.
    joukkueTaulukko[i]["jasenet"].sort((a, b) =>
    a.localeCompare(b, "fi", { sensitivity: "base" })
  );
  }

  
  for(let i = 0; i < joukkueTaulukko.length;i++){

    let li1 = document.createElement("li");  // Luodaan li -elementti.    
    li1.appendChild(document.createTextNode(joukkueTaulukko[i]["nimi"]));  // Asetetaan li -elementille sisältö.

    let pituus1 = sarjaIdJaNimi.length;
    let counter1 = 0;
    while(pituus1 != 0){

      try{
        if (sarjaIdJaNimi[counter1]["id"] == joukkueTaulukko[i]["sarja"]){

          let sarjanNimi = sarjaIdJaNimi[counter1]["nimi"];
          let strong = document.createElement("strong");  // Luodaan strong -elementti.

          strong.textContent = "  " + sarjanNimi;
          li1.appendChild(strong);
          list.appendChild(li1);  // Asetetaan li -elementti ul- elementin lapsoseksi.
          break;
        }

      }catch(e){
        console.log("Sarjan id:tä ei löytynyt");
      }
      pituus1--;
      counter1++;
    }

    

    let ul = document.createElement("ul");  // Luodaan ul -elementti.
    li1.appendChild(ul);  // Asetetaan ul -elementti li- elementin lapsoseksi.

    let pituus = joukkueTaulukko[i]["jasenet"].length;
    let counter = 0;

    while(pituus != 0){

        let li = document.createElement("li");  // Luodaan li -elementti.
        li.appendChild(document.createTextNode(joukkueTaulukko[i]["jasenet"][counter]));  // Asetetaan li -elementille sisältö.
        ul.appendChild(li);  // Asetetaan li -elementti ul- elementin lapsoseksi.
        pituus--;
        counter++;
    
    }
  }
return list;
}



/**
 * Funktio päivittää rasti listan.
 */
 function paivitaJoukkueet(){

  // Etsitään elementti id:n perusteella.
  let list = document.getElementById("lista");
  list.textContent = ""; // Tyhjennetään div id="lista".

  // Tyhjennetään molemmat taulukot.
  joukkueTaulukko = [];
  sarjaIdJaNimi = [];

  // Kutsutaan joukkueetDeep ja luoSarjanNimiJaId metodeja, jotka täyttävät taulukot uudestaan.
  joukkueetDeep();
  luoSarjanNimiJaId();

  // Tyhjennetään jälleen div id="lista".
  list.textContent = "";

  // Järjestetään joukkueiden nimet aakkosjärjestykseen.
  joukkueTaulukko.sort(compareJoukkue);

  // Järjestetään jäsenet.
  for(let i = 0; i < joukkueTaulukko.length;i++){
    joukkueTaulukko[i]["jasenet"].sort((a, b) =>
    a.localeCompare(b, "fi", { sensitivity: "base" })
  );
  }
  // Täytetään div id = "lista" uudestaan.
  list.appendChild(createJoukkueetList(joukkueTaulukko[0]));
  createJoukkueetList(joukkueTaulukko.set0);
  console.log();
}



}

/** 
 * Apufunktio, joka vertailee joukkeuiden nimiä.
 *
 * @param {*} joukkue1
 * @param {*} joukkue2
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
 * Apumetodi, joka vertailee annettuja arvoja.
 * @param {*} a
 * @param {*} b
 * @returns -1,1 tai 0
 */
 function compareName(a, b) {
  if (a.nimi < b.nimi) {
    return -1;
  }
  if (a.nimi > b.nimi) {
    return 1;
  }
  return 0;
}

window.addEventListener("load", alustus);
