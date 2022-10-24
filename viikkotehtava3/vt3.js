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
 let leimaustavatT = [];


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
  let jasenet = document.getElementsByClassName("jasenet");
  console.log("Joukkueen jasen 1: ", jasenet.value);

  // Nollataan.
  jasenetTaulukko = [];
// array fromilla
  for(let i = 0; i < jasenet.length;i++){
    jasenetTaulukko.push(jasenet[i].value);
    console.log(jasenetTaulukko);
  }

  luoJasenetT();


 
  // Etsitään jäsen 2 -input elementin sijainti.
  //let jasen2 = document.getElementById("jasen2");
  //console.log("Joukkueen jasen 2: ", jasen2.value);

  //Etsitään checkbox lementtien sijainti
  let cbox = document.getElementsByName("cb");
  console.log("checkboxit: ", cbox.value);

  // Näiden avulla lisätään tai ei lisätä joukkuetta. Käytännössä true, false.
  let leimausJudgement;
  let jasenJudgement;
  let nimiJudgement;
  let pituusJudgement;

     if(jasenet.value != ""){
    addNew();
  }   

  //addNew();

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

    if(jnimi.value.trim().localeCompare(joukkue.nimi.trim(), 'fi', { sensitivity: 'base' }) == 0){
      jnimi.setCustomValidity("Joukkue on jo olemassa!");
      jnimi.reportValidity();
      pituusJudgement = -1;
      break;
    } 
    else{
      jnimi.setCustomValidity("");
      jnimi.reportValidity();
      pituusJudgement = 1;
    }
  } 
      jnimi.setCustomValidity("");
      jnimi.reportValidity();

  // Jasenien validointi.
    if ((jasenetTaulukko.length < 2)) {
      jasenet[0].setCustomValidity("Oltava vähintään kaksi jäsentä!");
      jasenet[0].reportValidity();
      jasenJudgement = -1;
    } else {
      jasenet[0].setCustomValidity("");
      jasenet[0].reportValidity();
      jasenJudgement = 1;
    }
      jasenet[0].setCustomValidity("");
      jasenet[0].reportValidity(); 


  // Leimaustavan validointi.
  if(getLeimaustapa(cbox).length == 0){
    document.getElementById("NFC").setCustomValidity("Leimaustapaa ei ole valittu");
    document.getElementById("NFC").reportValidity();
    leimausJudgement = -1;
  }else {
    document.getElementById("NFC").setCustomValidity("");
    document.getElementById("NFC").reportValidity();
    leimausJudgement = 1;
  }
    document.getElementById("NFC").setCustomValidity("");
    document.getElementById("NFC").reportValidity();
  

  // Jos judgementit sen sallii, luodaan uusi joukkue.  
  if (jasenJudgement == 1 && nimiJudgement == 1 && pituusJudgement == 1 && leimausJudgement == 1){
    uusiJoukkue(jnimi.value,sarjanId,getLeimaustapa(cbox)); //poistettu jasen1.value,jasen2.value
  }
 

  paivitaJoukkueet();
  localStorage.setItem("TIEA2120-vt3-2022s", JSON.stringify(data)); // Tallennetaan localstorageen.
  form.reset(); 

  // Etsitään radiobuttonit.
  let boxes = document.getElementById("boxes");
  boxes.textContent = "";  // poistetaan radiobuttonit.

  lisaaRadioBox();  // Luodaan ne uudestaan => alkuperäinen tilanne.

  let tyhja = false; 

  for(let i = inputit.length-1 ; i >= 1; i--) { // inputit näkyvät ulommasta funktiosta
    let input = inputit[i];
    if ( input.value.trim() == "") {
      tyhja = true;
  }

      if ( input.value.trim() == "" && tyhja) { // ei kelpuuteta pelkkiä välilyöntejä
        inputit[i].parentNode.parentNode.remove(); // parentNode on label, joka sisältää inputin
      }
  }

  console.log(data.joukkueet);
});


   // dynaaminen lista koko sivun input-elementeistä
    // voisi käyttää myös omaa taulukkoa tms.
    let inputit = document.getElementsByClassName("jasenet"); // live nodelist kaikista input-elementeistä
    inputit[0].addEventListener("input", addNew); //tulee input --> uusi input
    let inputinID = document.getElementById("jasenetField");

    function addNew(e) {
        let tyhja = false;  // oletuksena ei ole löydetty tyhjää

        // käydään läpi kaikki input-kentät viimeisestä ensimmäiseen
        // järjestys on oltava tämä, koska kenttiä mahdollisesti poistetaan
        // ja poistaminen sotkee dynaamisen nodeList-objektin indeksoinnin
        // ellei poisteta lopusta 
        for(let i = inputit.length-1 ; i>-1; i--) { // inputit näkyvät ulommasta funktiosta
            let input = inputit[i];

            // jos on tyhjä ja on jo aiemmin löydetty tyhjä niin poistetaan
            if ( input.value.trim() == "" && tyhja) { // ei kelpuuteta pelkkiä välilyöntejä
                inputit[i].parentNode.remove(); // parentNode on label, joka sisältää inputin
            }

	    // onko tyhjä?
            if ( input.value.trim() == "") {
                    tyhja = true;
            }
        }

        // jos ei ollut tyhjiä kenttiä joten lisätään yksi
        if ( !tyhja) {
            let pp = document.createElement("p");
            let label = document.createElement("label");
            label.textContent = "Jäsen";
            label.className = "vasen";
            let input = document.createElement("input");
           // input.id = "jasen" + inputit;
            input.setAttribute("class", "jasenet");
            input.addEventListener("input", addNew);
            pp.appendChild(label).appendChild(input);
            inputinID.appendChild(pp);

            let vali = document.createElement("br");
            pp.appendChild(vali);
        }


        // tehdään kenttiin numerointi
        for(let i=0; i<inputit.length; i++) { // inputit näkyy ulommasta funktiosta
                let label = inputit[i].parentNode;
                label.firstChild.nodeValue = "Jäsen " + (i+1); // päivitetään labelin ekan lapsen eli tekstin sisältö
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
  leimaustavatT = [];

 for(let i = 0; i < array.length;i++){
  if(array[i].checked == true){
    leimaustavatT.push(i.toString());
  }
}
return leimaustavatT;
}

 
function naytaLeimaustavat(){

  let leimat = data.leimaustavat;

/*   for (let i = 0; i < joukkueTaulukko.length; i++){
    if ( joukkueTaulukko[i]["leimaustavat"][i] == //jotain)
  }
 */
}

/**
 * Luodaan uusi joukkue.
 * 
 * @param {*} nimi 
 * @param {*} sarja 
 * @param {*} jasen1 
 * @param {*} jasen2 
 */
function uusiJoukkue(nimi,sarja,cbox){ //poistettu jasen1,jasen2

  // Nollataan jasenetTaulukko.
 // jasenetTaulukko = [];

  //luoJasenetT(); //poistettu jasen1,jasen2

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
 * @param {String} jasen1 ///eipä ollukkaa
 * @param {String} jasen2 
 */
function luoJasenetT(){

for ( let jasen of jasenetTaulukko){
   if(jasen == ""){
     let index = jasenetTaulukko.indexOf(jasen); 
     jasenetTaulukko.splice(index,1);
  }
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



/// TODO: Leimaustavat aakkosjärjestys