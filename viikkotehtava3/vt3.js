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


 // Kutsutaan funktioita:
 joukkueet(); 
 lisaaCheckBox();

 // Luodaan globaalit taulukot:
 //let joukkueTaulukko = [];

 // Olemassa olevat sarjat: ESIM:
 // 4h, 2h, 8h, 6 tuntia, pitkä sarja 14 ja pitkä sarja 11



  // tänne oma koodi
  console.log(data);
  // tallenna data sen mahdollisten muutosten jälkeen aina localStorageen. 
  // localStorage.setItem("TIEA2120-vt3-2022s", JSON.stringify(data));
  // kts ylempää mallia
  // varmista, että sovellus toimii oikein omien tallennusten jälkeenkin
  // eli näyttää sivun uudelleen lataamisen jälkeen edelliset lisäykset ja muutokset
  // resetoi rakenne tarvittaessa lisäämällä sivun osoitteen perään ?reset=1
  // esim. http://users.jyu.fi/~omatunnus/TIEA2120/vt2/pohja.xhtml?reset=1



/**
 * Funktiolla lisaaCheckBox luodaan checkbox -ja niiden label -elementit.
 */
function lisaaCheckBox(){

  // Etsii div elementint id:n perusteella.
  let boxit = document.getElementById("boxes");

  let sarjat = data.sarjat;

  // Käydään datan sarjat läpi ja luodaan checkboxit + labelit.
  for(let sarja of sarjat){

    // Luodaan label ja tarvittavat attribuutit.
    let label = document.createElement("label");
    label.className = "oikea";
    label.appendChild(document.createTextNode(sarja.nimi));
    
    boxit.appendChild(label);

    // Luodaan checkboxit ja tarvittavat attribuutit.
    let cbox = document.createElement("input");
    cbox.type = "radio";
    cbox.name = "rg";
    cbox.id = sarja.nimi;
    cbox.checked = true; // Tällöin viimeinen on aina checked.

    label.appendChild(cbox);

    // Luodaan väli.
    let breik = document.createElement("br");
    boxit.appendChild(breik);
  }
}





// Valitsee ensimmäisen form -elementin.
let form = document.forms["lomake"];

/**
 * Asetetaan lisaa napin toimivuus, mahdollistetaan rastin lisääminen
 * tietokantaan.
 */
 form.addEventListener("submit", function (e) {
               
  e.preventDefault(); // estetään lomakkeen lähettäminen

  // Etsitään nimi -input elementin sijainti.
  let jnimi = document.forms.lomake[1];
  console.log("Joukkueen nimi: ", jnimi.value);

  
  let sarjanId;
  // Etsitään valittu checkbox ja tämän sarjan id.
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
  let jasen2 = document.getElementById("jasen2");
  console.log("Joukkueen jasen 2: ", jasen2.value);

  uusiJoukkue(jnimi.value,sarjanId,jasen1.value,jasen2.value);
  localStorage.setItem("TIEA2120-vt3-2022s", JSON.stringify(data)); // Tallennetaan localstorageen.

  console.log(data.joukkueet);

  form.reset();   
  
});

/**
 * Luodaan uusi joukkue.
 * 
 * @param {*} nimi 
 * @param {*} sarja 
 * @param {*} jasen1 
 * @param {*} jasen2 
 */
function uusiJoukkue(nimi,sarja,jasen1,jasen2){

  let newTeam = {
    aika: "00:00:00",
    jasenet: [jasen1,jasen2],
    leimaustapa:["0"],
    matka: 0,
    nimi: nimi,
    pisteet: 0,
    rastileimaukset: [],
    sarja: sarja,
    
  };
  data.joukkueet.push(newTeam);
}



/**
 * Funktiolla luodaan deepcopy taulukko alkuperäisestä data.joukkueet taulukosta.
 */
 function joukkueet(){

  let joukkueTaulukko = [];

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
  console.log(joukkueTaulukko);
}


}




window.addEventListener("load", alustus);
