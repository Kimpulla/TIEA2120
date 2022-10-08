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
        joukkueet();

       // korvaaTulokset();


	console.log(data);

	console.log(data.documentElement);
	console.log(data.documentElement.getElementsByTagName("joukkue"));
        console.log(data.documentElement.getElementsByTagName("sarja"));

        //console.log(getSarjaById("6995217"));

        let p = document.createElement('p');
        p.textContent = "tesingss11";
        let otsikko = document.documentElement.getElementsByTagName('h1');
        otsikko[0].appendChild(p);

        
 
        // savedata tallentaa datan selaimen LocalStorageen. Tee tämä aina, kun
        // ohjelmasi on muuttanut dataa. Seuraavalla sivun latauskerralla
        // saat käyttöösi muuttamasi datan
	savedata(data);

/**
 * Luodaan taulukko joukkueista.
 * 
 */
function joukkueet(){
        let joukkueet = data.documentElement.getElementsByTagName("joukkue");
        let sarjat = data.documentElement.getElementsByTagName("sarja");

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
        for (let joukkue of joukkueTaulukko){
                if (joukkue["sarja"] ){

                }
        }
console.log();
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