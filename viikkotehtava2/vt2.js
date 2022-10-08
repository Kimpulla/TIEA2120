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

        let joukkueTaulukko = [];
        let sarjaTaulukko = [];
        joukkueet();
        sarjat();
        editJoukkueet();
        

       // korvaaTulokset();


	console.log(data);

	console.log(data.documentElement);
	console.log(data.documentElement.getElementsByTagName("joukkue"));
        console.log(data.documentElement.getElementsByTagName("sarja"));

        
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
console.log();
}


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
         //Kutsutaan compareJoukkue ja järjestetään joukkueet aakkosjärjestykseen.
         
         console.log(joukkueTaulukko.sort(compareJoukkue));
}



let table = document.querySelector("table");
let data1 = joukkueTaulukko;
let th = Object.keys(joukkueTaulukko[0]);
createTable(table, data1);
createTableHead(table, th);



//all good
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



function createTable(table, data1) {
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

 


function korvaaJoukkue(){
        let joukkueet = data.documentElement.getElementsByTagName("joukkue");
        let jnimi;
        for(let joukkue of joukkueet){
                if(joukkue.childNodes.nimi[""] != null){
                        jnimi = joukkue.childNodes.nimi;
                        console.log(jnimi);
                }
              //  let replace = joukkueet.getElementById("Joukkue 1");
              //  replace.parentNode.replaceChild(document.createTextNode(jnimi), replace);
             //   th.parentNode.replaceChild(document.createTextNode(jnimi), th);
        }


}