"use strict";
//@ts-check
/* globals reset: true */
/* globals savedata: true */
// voit tutkia käsiteltävää dataa suoraan osoitteesta
// https://appro.mit.jyu.fi/cgi-bin/tiea2120/randomize.cgi
// data muuttuu hieman jokaisella latauskerralla

// jos reset == true, ladataan aina uusi data. jos reset == false, käytetään
// localStorageen tallennettua versiota, jossa näkyvät omat lisäykset
// testaa sovellusta molemmilla arvoilla
// localStoragen voi myös itse tyhjentää Storage-välilehden kautta

reset = false;

// tätä funktiota kutsutaan automaattisesti käsiteltävällä datalla
// älä kutsu tätä itse!
function start(data) {
	// tästä eteenpäin omaa koodia
        // vinkki: muunna data ensimmäisen viikkotehtävän tyyppiseksi rakenteeksi
        // jolloin saat siitä helpommin ja tehokkaammin käsiteltävää
        // dataa voi tutkia myös osoitteesta: https://appro.mit.jyu.fi/cgi-bin/tiea2120/randomize.cgi
        // huom. datan sisältö muuttuu hieman jokaisella latauskerralla

        // Määritetään taulukkoja.
        let joukkueTaulukko = [];
        let sarjaTaulukko = [];
        let rastiTaulukko = [];

        // Kutsutaan funktioita.
        joukkueet();
        sarjat();
        rastit();
        editJoukkueet();
       


        // Table.
        let table = document.querySelector("table");
        let data1 = joukkueTaulukko;
        let th = Object.keys(joukkueTaulukko[0]);
        createTable(table, data1);
        createTableHead(table, th);


        // Luodaan rastiTaulukosta taulukko, jotta sitä voidaan iteroida.
        // Hieman liian paljon välivaiheita, kun saisi paljon helpommallakin,
        // mutta tulipahan tehtyä.
        let rastitIteroitava = rastiTaulukko.map(a => a.koodi);
        rastitIteroitava.sort(compareRastit); 
        console.log(rastitIteroitava);


        document.getElementById("rastit").appendChild(createRastitList(rastiTaulukko[0]));
        createRastitList(rastiTaulukko.set0);       
        


	//console.log(data);

	//console.log(data.documentElement);
	//console.log(data.documentElement.getElementsByTagName("joukkue"));
        //console.log(data.documentElement.getElementsByTagName("sarja"));
        console.log(data.documentElement.getElementsByTagName("rastit"));

        
        // savedata tallentaa datan selaimen LocalStorageen. Tee tämä aina, kun
        // ohjelmasi on muuttanut dataa. Seuraavalla sivun latauskerralla
        // saat käyttöösi muuttamasi datan
	savedata(data);

/**
 * Funktiolla luodaan taulukko sarjoista.
 * Esim.
 * sarjatTaulukko = [{alkuaika:"", id:"13", kesto:"3", loppuaika:"", nimi:"4h"}]
 * 
 */
 function sarjat(){

        let sarjat = data.documentElement.getElementsByTagName("sarja");
        for (let sarja of sarjat) {
                let sarj = {
                "alkuaika": sarja.getAttribute("alkuaika"),
                "id": sarja.getAttribute("id"),
                "kesto": sarja.getAttribute("kesto"),
                "loppuaika": sarja.getAttribute("loppuaika"),
                "nimi": sarja.getElementsByTagName("nimi")[0].textContent
        };
        sarjaTaulukko.push(sarj);      
        }
console.log();
}



/**
 * Funktiolla luodaan taulukko joukkueista.
 * Esim.
 * joukkueetTaulukko = [{aika:"", matka:"13",..., Joukkue:"ukkelit"}]
 * 
 */
function joukkueet(){

        let joukkueet = data.documentElement.getElementsByTagName("joukkue");
        for (let joukkue of joukkueet) {
                let jou = {
                //"aika": joukkue.getAttribute("aika"),
                //"matka": joukkue.getAttribute("matka"),
                //"pisteet": joukkue.getAttribute("pisteet"),
                "Sarja": joukkue.getAttribute("sarja"),
                "Joukkue": joukkue.getElementsByTagName("nimi")[0].textContent
        };
        joukkueTaulukko.push(jou);      
        }
        //console.log();
}


/**
 * Funktiolla luodaan taulukko rasteista.
 * Esim.
 * rastitTaulukko = [{id:"12345", koodi:"13", lat:"62.34", lon:"25.324"}]
 * 
 */
 function rastit(){

        let rastit = data.documentElement.getElementsByTagName("rasti");
        for (let rasti of rastit) {
                let ras = {
                "id": rasti.getAttribute("id"),
                "lat": rasti.getAttribute("lat"),
                "lon": rasti.getAttribute("lon"),
                "koodi": rasti.getAttribute("koodi")
                
        };
        rastiTaulukko.push(ras);      
        }
        console.log(rastiTaulukko);
}


/**
 * Funktiolla editJoukkueet muutetaan joukkueTaulukkoa siten,
 * että tarkistetaan onko ( joukkue["Sarja"] --> "3124" ) eli ID sama kuin
 * sarjaTaulukon sarjan id. Jos on laitetaan tämän sarjan nimi joukkueen sarjan
 * id:n tilalle.
 */
function editJoukkueet(){

        for (let joukkue of joukkueTaulukko){
                for (let sarja of sarjaTaulukko){
                if(joukkue["Sarja"] == sarja["id"]){
                        joukkue["Sarja"] = sarja["nimi"];
                }
                else{
                        //console.log( "joukkueen ID:"+ joukkue["Sarja"] +
                        //":n ID ei ole sama kuin sarjan ID:"+sarja["id"]); 
                }     
                } 
        }
        //Poistetaan whitepsacet joukkueen nimen alusta ja lopusta.
        for(let joukkue of joukkueTaulukko){
                if (/\s/.test(joukkue["Joukkue"])) {
                
                        let word = joukkue["Joukkue"];
                        let result = word.trim();
                        joukkue["Joukkue"]=result;
                }
         }
         // Järjestetään joukkueet.
         joukkueTaulukko.sort(compareJoukkue);
}


/**
 * Funktiolla createTableHead luodaan taulukon osio <thead>.
 * @param {Element} table - table elementti.
 * @param {Array} th - taulukko.
 */
function createTableHead(table,th) {
        let thead = table.createTHead();
        let row = thead.insertRow();
        for (let key of th) {
                let th = document.createElement("th");
                let text = document.createTextNode(key);
                th.appendChild(text);
                row.appendChild(th);
              }
}


/**
 * Funktiolla createTable luodaan table.
 * 
 * @param {Element} table  - table elementti.
 * @param {Array} data1 - taulukko
 */
function createTable(table, data1) {
        
        let caption = table.createCaption();
        caption.textContent = "Tulokset";

        for (let element of data1) {
          let row = table.insertRow();
          for (let key in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
          }
          //console.log();
        }
}


/**
 * Funktiolla createRastitList luodaan ul ja li elementit rasteille.
 * 
 * @returns listan.
 */
function createRastitList() {
        // Luodaan ul -elementti.
        let list = document.createElement("ul");
       
        for (let rasti of rastitIteroitava) {
                // Luodaan li -elementti.
                let item = document.createElement("li");
                
                // Asetetaan li -elementille sisältö.
                item.appendChild(document.createTextNode(rasti));
                
                // Asetetaan li -elementti ul- elementin lapsoseksi.
                list.appendChild(item);
        }
return list;
}
           

// Valitsee ensimmäisen form -elementin.
let form = document.forms["lomake"];

/**
 * Asetetaan lisaa napin toimivuus, mahdollistetaan rastin lisääminen
 * tietokantaan.
 */
 form.addEventListener("submit", function (e) {
               
        e.preventDefault(); // estetään lomakkeen lähettäminen
        // let lomake = e.target;

        //console.log("lomakkeen sisältö: ---------------------------");

        let lat = document.forms.lomake[1];
        //console.log("lat: ", lat.value);

        let lon = document.forms.lomake[2];
        //console.log("lon: ", lon.value);

        let koodi = document.forms.lomake[3];
        //console.log("koodi: ", koodi.value);

        if (!(isNaN(Number(lat.value) )) && !(isNaN(Number(lon.value) ))){

        let rasti = data.createElement("rasti");
        let idee = checkId(generateId());

        rasti.setAttribute("id", idee);
        rasti.setAttribute("lat", lat.value);
        rasti.setAttribute("lon", lon.value);
        rasti.setAttribute("koodi", koodi.value);
      
        // Lisätään dataan elementin rastit lapseksi.
        data.getElementsByTagName("rastit")[0].appendChild(rasti);
      
        // Tyhjätään inputit submittauksen jälkeen.
        form.reset();
        paivitaRastit();
        savedata(data);      
        }          
});


/**
 * Funktio checkId tarkistaa onko rastin id uniikki. 
 * Jos rastin id ei ole uniikki, lisätään siihen yksi ja käydään
 * rastit uudestaan läpi.
 * 
 * @param {String} id - numero.
 * @returns rastin id.
 */
function checkId(id){

        let arrayT = data.documentElement.getElementsByTagName("rasti");
        for (let rasti of arrayT){   
                if(rasti.id == id){
                        id++;
                        checkId();
                }
                return id;
        }
}
/**
 * Funktio päivittää rasti listan.
 */
function paivitaRastit(){

        // Etsitään elementti id:n perusteella.
        let list = document.getElementById("rastit");
        list.textContent = ""; // Tyhjennetään div id="rastit".

        // Tyhjennetään molemmat taulukot.
        rastitIteroitava = [];
        rastiTaulukko = [];

        // Kutsutaan rastit metodia, joka täyttää rastiTaulukko taulukon.
        rastit();
        // Tyhjennetään jälleen div id="rastit".
        list.textContent = "";

        // Luodaan rastiTaulukosta taulukko, jotta sitä voidaan iteroida/sortata.
        // Hieman liian paljon välivaiheita, kun saisi paljon helpommallakin,
        // mutta tulipahan tehtyä.
        rastitIteroitava = rastiTaulukko.map(a => a.koodi);
        rastitIteroitava.sort(compareRastit); 

        // Täytetään div id = "rastit" uudestaan.
        list.appendChild(createRastitList(rastiTaulukko[0]));
        createRastitList(rastiTaulukko.set0);
        console.log();
}

}




/**
 * Luo id:n päivämäärästä 1.1.1970 koodin ajamisen ajankohtaan millisekunteina.
 *
 * @returns {Number} - id:n.
 */
 function generateId() {
        return new Date().getTime();
      }
      

/**
 * Apumetodi compareRastit, järjestää rastit.
 *
 * @param {String} a
 * @param {String} b
 * @returns  rastit oikeassa järjestyksessä.
 */
 function compareRastit(a, b) {
        let tulos = a.localeCompare(b, "fi", { sensitivity: "base" });


        if (a.replace(/[0-9]/g, "").length >= 2) {
          if (b.replace(/[0-9]/g, "").length >= 2) {
            return tulos;
          }
          return 1;
        } else {
          if (b.replace(/[0-9]/g, "").length >= 2) {
            return -1;
          }
        }
      
        return tulos;
      }
      
     
 /** 
 * Apufunktio, joka vertailee joukkeuiden nimiä.
 *
 * @param {*} joukkue1
 * @param {*} joukkue2
 * @returns -1, 0 tai 1
 */

 function compareJoukkue(joukkue1, joukkue2) {

        if (joukkue1["Sarja"].toLowerCase() < joukkue2["Sarja"].toLowerCase()) {
                return -1;
        }
        if (joukkue1["Sarja"].toLowerCase() > joukkue2["Sarja"].toLowerCase()) {
                return 1;
        }
        if (joukkue1["Joukkue"].toLowerCase() < joukkue2["Joukkue"].toLowerCase()) {
                return -1;
        }
        if (joukkue1["Joukkue"].toLowerCase() > joukkue2["Joukkue"].toLowerCase()) {
                return 1;
        }
        return 0;
}

 


