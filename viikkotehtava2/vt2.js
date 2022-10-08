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

	console.log(data);

	console.log(data.documentElement);
	console.log(data.documentElement.getElementsByTagName("joukkue"));
        console.log(data.documentElement.getElementsByTagName("sarja"));

        //console.log(getSarjaById("6995217"));

        let p = document.createElement('p');
        p.textContent = "tesingss11";
        let otsikko = document.documentElement.getElementsByTagName('h1');
        otsikko[0].appendChild(p);

        joukkue();
 
        // savedata tallentaa datan selaimen LocalStorageen. Tee tämä aina, kun
        // ohjelmasi on muuttanut dataa. Seuraavalla sivun latauskerralla
        // saat käyttöösi muuttamasi datan
	savedata(data);

/**
 * Luodaan taulukko joukkeista.
 * 
 */
function joukkue(){
        let joukkueet = data.documentElement.getElementsByTagName("joukkue");
        let joukkueTaulukko = [];
        for (let joukkue of joukkueet) {
                let jou = {
                "aika": joukkue.getAttribute("aika"),
                "matka": joukkue.getAttribute("matka"),
                "pisteet": joukkue.getAttribute("pisteet"),
                "sarja": joukkue.getAttribute("sarja"),
                "nimi": joukkue.getElementsByTagName("nimi")
        };
        joukkueTaulukko.push(jou);
                
}
        console.log(JSON.parse(JSON.stringify("omaT: "+joukkueTaulukko)));
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