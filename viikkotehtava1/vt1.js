"use strict";
//@ts-check
// Joukkueen sarja on viite data.sarjat-taulukossa lueteltuihin sarjoihin
// Joukkueen rastileimausten rastit ovat viitteitä data.rastit-taulukossa lueteltuihin rasteihin
// Kirjoita tästä eteenpäin oma ohjelmakoodisi

/**
 * Taso 1
 * Järjestää leimaustavat aakkosjärjestykseen
 * isoilla ja pienillä kirjaimilla ei ole järjestämisessä merkitystä
 * Alkuperäistä rakennetta ei saa muuttaa tai korvata vaan järjestäminen tehdään alkup. taulukon kopiolle.
 * @param {Object} data - tietorakenne, jonka data.leimaustavat-taulukon kopio järjestetään
 * @return {Array} palauttaa järjestetyn _kopion_ data.leimaustavat-taulukosta
 */
function jarjestaLeimaustavat(data) {
  console.log(data);
  const leimaustavat = JSON.parse(JSON.stringify(data.leimaustavat)); // Luodaan kopio nimellä "leimaustavat".
  leimaustavat.sort(); // Järjestetään kopio aakkosjärjestykseen.

  return leimaustavat; // Palautetaan järjestetty kopio.
}

/**
 * Taso 1
 * Järjestää sarjat aakkosjärjestykseen sarjan nimen perustella
 * isoilla ja pienillä kirjaimilla ei ole järjestämisessä merkitystä
 * Alkuperäistä rakennetta ei saa muuttaa tai korvata vaan järjestäminen tehdään alkup. taulukon kopiolle.
 * @param {Object} data - tietorakenne, jonka data.sarjat-taulukon kopio järjestetään
 * @return {Array} palauttaa järjestetyn _kopion_ data.sarjat-taulukosta
 */
function jarjestaSarjat(data) {
  const sarjat = Array.from(data.sarjat, (sarja) => {
    let a = {
      alkuaika: sarja.alkuaika,
      id: sarja.id,
      kesto: sarja.kesto,
      nimi: sarja.nimi,
      joukkueet: sarja.joukkueet,
    };
    return a;
  });
  sarjat.sort(compareName);
  return sarjat; // Palautetaan järjestetty kopio.
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

/**
 * Taso 1
 * Lisää uuden sarjan data-rakenteeseen ja palauttaa muuttuneen datan
 * Sarja lisätään vain jos kaikki seuraavat ehdot täyttyvät:
 * Toista samannimistä sarjaa ei ole olemassa. Nimien vertailussa
 * ei huomioida isoja ja pieniä kirjaimia tai nimen alussa ja lopussa välilyöntejä etc. (whitespace)
 * sarjan nimi ei voi olla pelkkää whitespacea.
 * Sarjan keston täytyy olla kokonaisluku ja suurempi kuin 0
 * Uusi sarja tallennetaan data.sarjat-taulukkoon. Sarjan on oltava seuraavaa muotoa:
 *  {
 *     "id": {Number}, // Jokaisella sarjalle oleva uniikki kokonaislukutunniste, pakollinen tieto
 *     "nimi": {String}, // Sarjan uniikki nimi, pakollinen tieto
 *     "kesto": {Number}, // sarjan kesto tunteina, pakollinen tieto
 *     "alkuaika": {String}, // Sarjan alkuaika, oletuksena ""
 *     "loppuaika": {String}, // Sarjan loppuaika, oletuksena ""
 *     "joukkueet": {Array}, // Taulukko sarjaan kuuluvista joukkueista. Oletuksena tyhjä taulukko []
 *  }
 * @param {Object} data - tietorakenne johon sarja lisätään
 * @param {String} nimi - Lisättävän sarjan nimi
 * @param {String} kesto - Sarjan kesto merkkijonona
 * @param {String} alkuaika - Sarjan alkuaika, ei pakollinen
 * @param {String} loppuaika - Sarjan loppuaika, ei pakollinen
 * @return {Object} palauttaa muutetun alkuperäisen data-tietorakenteen
 */
function lisaaSarja(data, nimi, kesto, alkuaika, loppuaika) {
  if (
    !data.sarjat.some((sarja) => sarja.nimi === nimi) &&
    kesto > 0 &&
    whitespaceCheck(nimi) == false
  ) {
    let id = generateId();
    // Tarkistetaan onko id jo olemassa, jos on luodaan uusi id.
    while (findId(data.sarjat, id) == true) {
      id = generateId();
    }

    let obj = {
      nimi: nimi,
      kesto: parseInt(kesto),
      id: id,
      alkuaika: alkuaika,
      loppuaika: loppuaika,
    };

    data.sarjat.push(obj);
  } else {
    console.log("Error");
  }
  return data;
}

/**
 * Apumetodi, jolla selvitetään onko id data.sarjat taulukossa.
 *
 * @param {Array} arr
 * @param {String} input
 * @returns true, jos input löytyy taulukosta.
 */
function findId(arr, input) {
  if (arr.some((sarja) => sarja.id === parseInt(input))) {
    return true;
  }
  return false;
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
 * Tarkastaa onko merkkijono tyhjä. Käyttää apuna {@link String.trim} metodia.
 *
 * @param {String} str - tarkastettava merkkijono.
 * @returns - palauttaa true, jos merkkijono on sisällöltään tyhjä.
 */
function whitespaceCheck(str) {
  return str.trim().length === 0;
}

/**
 * Taso 1
 * Poistaa joukkueen id:n perusteella data-rakenteesta ja palauttaa muuttuneen datan
 * @param {Object} data - tietorakenne josta joukkue poistetaan
 * @param {String} id - poistettavan joukkueen id
 * @return {Object} palauttaa muuttuneen alkuperäisen datan
 */
function poistaJoukkue(data, id) {
  for (let joukkue of data.joukkueet) {
    if (joukkue.id == id) {
      data.joukkueet.splice(data.joukkueet.indexOf(joukkue), 1);
    }
  }
  return data;
}

/**
 * Taso 3
 * Järjestää rastit aakkosjärjestykseen rastikoodin perustella siten, että
 * numeroilla alkavat rastit ovat kirjaimilla alkavien jälkeen. Alkuperäistä
 * rakennetta ei saa muuttaa tai korvata vaan järjestäminen tehdään alkup. taulukon kopiolle.
 * isoilla ja pienillä kirjaimilla ei ole järjestämisessä merkitystä
 * @param {Object} data - tietorakenne, jonka data.rastit-taulukon kopio järjestetään
 * @return {Array} palauttaa järjestetyn _kopion_ data.rastit-taulukosta
 */
function jarjestaRastit(data) {
  let rastit = JSON.parse(JSON.stringify(data.rastit)); // Kopioidaan taulukko tietorakenteesta.
  rastit.sort(compareRastit);

  return rastit; // tässä pitää palauttaa järjestetty kopio
}

/**
 * Apumetodi compareRastit, järjestää rastit.
 *
 * @param {String} a
 * @param {String} b
 * @returns  rastit oikeassa järjestyksessä.
 */
function compareRastit(a, b) {
  let tulos = a.koodi.localeCompare(b.koodi, "fi", { sensitivity: "base" });

  if (a.koodi.replace(/[0-9]/g, "").length >= 2) {
    if (b.koodi.replace(/[0-9]/g, "").length >= 2) {
      return tulos;
    }
    return -1;
  } else {
    if (b.koodi.replace(/[0-9]/g, "").length >= 2) {
      return 1;
    }
  }

  return tulos;
}

/**
 * Taso 3
 * Lisää joukkueen data-rakenteeseen ja palauttaa muuttuneen datan
 * Joukkue lisätään vain jos kaikki seuraavat ehdot täyttyvät:
 *  - Toista samannimistä joukkuetta ei ole olemassa. Nimien vertailussa
 *    ei huomioida isoja ja pieniä kirjaimia tai nimen alussa ja lopussa välilyöntejä etc. (whitespace)
 *    Joukkueen nimi ei voi olla pelkkää whitespacea.
 *  - Leimaustapoja on annettava vähintään yksi kappale. Leimaustapojen
 *     on löydyttävä data.leimaustavat-taulukosta
 *  - Jäseniä on annettava vähintään kaksi kappaletta.
 *  - Saman joukkueen jäsenillä ei saa olla kahta samaa nimeä
 *  - Sarjan id on löydyttävä data.sarjat-taulukon sarjoista
 *
 *  Uusi joukkue tallennetaan data.joukkueet-taulukkoon. Joukkueen on oltava seuraavaa muotoa:
 *  {
 *     "id": {Number}, // jokaisella joukkueella oleva uniikki kokonaislukutunniste
 *     "nimi": {String}, // Joukkueen uniikki nimi
 *     "jasenet": {Array}, // taulukko joukkueen jäsenien nimistä
 *     "leimaustapa": {Array}, // taulukko joukkueen leimaustapojen indekseistä (data.leimaustavat)
 *     "rastileimaukset": {Array}, // taulukko joukkueen rastileimauksista. Oletuksena tyhjä eli []
 *     "sarja": {Object}, // viite joukkueen sarjaan, joka löytyy data.sarjat-taulukosta
 *     "pisteet": {Number}, // joukkueen pistemäärä, oletuksena 0
 *     "matka": {Number}, // joukkueen kulkema matka, oletuksena 0
 *     "aika": {String}, // joukkueen käyttämä aika "h:min:s", oletuksena "00:00:00"
 *  }
 * @param {Object} data - tietorakenne johon joukkue lisätään
 * @param {String} nimi - Lisättävän joukkueen nimi
 * @param {Array} leimaustavat - Taulukko leimaustavoista
 * @param {String} sarja - Joukkueen sarjan id-tunniste
 * @param {Array} jasenet - joukkueen jäsenet
 * @return {Object} palauttaa muutetun alkuperäisen data-tietorakenteen
 */
function lisaaJoukkue(data, nimi, leimaustavat, sarja, jasenet) {
  if (
    !data.joukkueet.some((joukkue) => joukkue.nimi === nimi) &&
    whitespaceCheck(nimi) == false &&
    leimaustavat.length >= 1 &&
    jasenet.length >= 2 &&
    hasDuplicates(jasenet) == false &&
    findId(data.sarjat, sarja) == true
  ) {
    try {
      let newTeam = {
        nimi: nimi,
        pisteet: 0,
        matka: 0,
        id: generateId(100000),
        jasenet: jasenet,
        leimaustapa: leimaustavat,
        rastileimaukset: [],
        sarja: palautaSarja(data.sarjat, sarja),
        aika: "00:00:00",
      };
      data.joukkueet.push(newTeam);
    } catch (error) {
      console.log("jokin meni vikaan:" + error.message);
    }

    return data;
  }
  return data;
}

/**
 * Apumetodi, jolla palautetaan haluttu sarja.
 *
 *
 * @param {Array} arr
 * @param {String} input
 * @returns sarjan
 */
function palautaSarja(arr, input) {
  let index;

  if (findId(arr, input) == true) {
    index = arr.map((object) => object.id).indexOf(parseInt(input));
  }
  return arr[index];
}

/**
 * Apumetodi, joka tarkastaa onka taulukossa duplikaatteja.
 *
 * @param {Array} array
 * @returns false, jos duplikaatteja ei ole.
 */
function hasDuplicates(array) {
  return new Set(array).size !== array.length;
}

/**
 * Taso 3
 * Laskee joukkueen käyttämän ajan. Tulos tallennetaan joukkue.aika-ominaisuuteen.
 * Käytä merkkijonoa, jossa aika on muodossa "hh:mm:ss". Esim. "07:30:35"
 * Aika lasketaan viimeisestä (ajan mukaan) LAHTO-rastilla tehdystä leimauksesta alkaen aina
 * ensimmäiseen (ajan mukaan) MAALI-rastilla tehtyyn leimaukseen asti. Leimauksia jotka tehdään
 * ennen lähtöleimausta tai maalileimauksen jälkeen ei huomioida.
 * @param {Object} joukkue
 * @return {Object} joukkue
 */
function laskeAika(joukkue) {
  let firstTime, afterTime, startTime, endTime, tulos;

  for (let obj of joukkue.rastileimaukset) {
    if (obj.rasti != null) {
      if (obj.rasti.koodi == "LAHTO") {
        firstTime = obj.aika;
        startTime = firstTime.substring(firstTime.indexOf(" ") + 1);
      }
      if (obj.rasti != null) {
        if (obj.rasti.koodi == "MAALI") {
          afterTime = obj.aika;
          endTime = afterTime.substring(afterTime.indexOf(" ") + 1);
        }
      }
    }
  }

  try {
    //katkaistaan ":" kohdalta
    let beginning = startTime.split(":");

    //muutetaan sekunneiksi
    let seconds = beginning[0] * 3600 + beginning[1] * 60 + beginning[2];

    //katkaistaan ":" kohdalta
    let ending = endTime.split(":");

    //muutetaan sekunneiksi
    let seconds2 = ending[0] * 3600 + ending[1] * 60 + ending[2];

    let date = new Date(2017, 3, 18);
    date.setSeconds(seconds2 - seconds);

    //otetaan vain kaksi merkitsevää lukua.
    tulos = date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");

    joukkue.aika = tulos;
  } catch (error) {}

  return joukkue;
}

/**
 * Taso 3 ja Taso 5
 *  Järjestää joukkueet järjestykseen haluttujen tietojen perusteella
 *  järjestetään ensisijaisesti kasvavaan aakkosjärjestykseen !!!!
 *
 *  Järjestäminen on tehtävä alkuperäisen taulukon kopiolle. Alkuperäistä ei saa muuttaa tai korvata.
 *  mainsort-parametrin mukaisen tiedon perusteella. mainsort voi olla nimi, sarja, matka, aika tai pisteet
 *  Joukkueen jäsenet järjestetään aina aakkosjärjestykseen. Alkuperäisen joukkueobjektin jäsenten järjestys ei saa muuttaa.
 *  Joukkueen leimaustavat järjestetään myös aina aakkosjärjestykseen leimaustapojen nimien mukaan
 *  Isoilla ja pienillä kirjaimilla ei ole missään järjestämisissä merkitystä eikä myöskään alussa tai lopussa olevalla whitespacella
 *
 *  sortorder-parametrin käsittely vain tasolla 5
 *  jos sortorder-parametrina on muuta kuin tyhjä taulukko, käytetään
 *  sortorderin ilmoittamaa järjestystä eikä huomioida mainsort-parametria:
 *  ensisijaisesti järjestetään taulukon ensimmäisen alkion tietojen perusteella,
 *  toissijaisesti toisen jne.
 *  sortorder-taulukko sisältää objekteja, joissa kerrotaan järjestysehdon nimi (key),
 *  järjestyssuunta (1 = nouseva, -1 = laskeva) ja järjestetäänkö numeerisesti (true)
 *  vai aakkosjärjestykseen (false)
 *  Toteuta sortorder-taulukon käsittely siten, että taulukossa voi olla vaihteleva määrä rivejä
 *  Sarja täytyy huomioida erikoistapauksena
 *	 sortorder = [
 *	 {"key": "sarja", "order": 1, "numeric": false},
 *	 {"key": "nimi", "order": 1, "numeric": false},
 *	 {"key": "matka", "order": -1, "numeric": true},
 *	 {"key": "aika", "order": 1, "numeric": false},
 *	 {"key": "pisteet", "order": -1, "numeric": true}
 *	]
 * @param {Object} data - tietorakenne, jonka data.rastit-taulukko järjestetään
 * @param {String} mainsort - ensimmäinen (ainoa) järjestysehto, joka voi olla nimi, sarja, matka, aika tai pisteet  TASO 3
 * @param {Array} sortorder - mahdollinen useampi järjestysehto TASO 5
 * @return {Array} palauttaa järjestetyn ja täydennetyn _kopion_ data.joukkueet-taulukosta
 */
function jarjestaJoukkueet(data, mainsort = "nimi", sortorder = []) {
  // Aakkosjärjestykseen
  // mainsort - mainsort voi olla nimi, sarja, matka, aika tai pisteet
  // Joukkueen jäsenet järjestetään aina aakkosjärjestykseen
  // Joukkueen leimaustavat järjestetään myös aina aakkosjärjestykseen leimaustapojen nimien mukaan

  let joukkueet = Array.from(data.joukkueet, (joukkue) => {
    let a = {
      jasenet: joukkue.jasenet,
      id: joukkue.id,
      aika: joukkue.aika,
      nimi: joukkue.nimi,
      matka: joukkue.matka,
      sarja: joukkue.sarja,
      rastileimaukset: joukkue.rastileimaukset,
      pisteet: joukkue.pisteet,
      leimaustapa: joukkue.leimaustapa,
    };

    return a;
  });
  
  // Updated 26.9.2022 02.14
  // Tässä olisi leimaustapojen järjestäminen, mutta yllätykseksi sen ajaminen
  // rikkoo joukkueen lisäämisen data.tietokantaan.
  // Tämän function alapuolella on apufunctio compareLeima, joka avusti prosessissa.
  /*
  for (let joukkue of joukkueet) {
    joukkue.leimaustapa.sort((a, b) => {
      return compareLeima(a, b, data.leimaustavat);
    });
  }
  */

  for (let joukkue of joukkueet) {
    joukkue.jasenet.sort((a, b) =>
      a.localeCompare(b, "fi", { sensitivity: "base" })
    );
  }

  if (mainsort == "nimi") {
    joukkueet.sort(sortTeams);
  }

  if (mainsort == "sarja") {
    joukkueet.sort(compareSarja);
  }

  if (mainsort == "aika") {
    joukkueet.sort(sortTime);
  }

  if (mainsort == "pisteet") {
    for (let i = 0; i < joukkueet.length - 1; i++) {
      if (joukkueet[i]["pisteet"] < joukkueet[i + 1]["pisteet"]) {
        return joukkueet[i]["pisteet"];
      }
    }
  }

  if (mainsort == "matka") {

  for (let i = 0; i < joukkueet.length-1 ; i++) {
    for (let j = 1; j < joukkueet.length-1 ; j++) {
    if (joukkueet[i]["matka"] < joukkueet[j]["matka "]) {
      return joukkueet[i]["matka"];
    }

  }
  }
  }

  return joukkueet;
}

/*
function compareLeima(leima1, leima2, leimaustavat) {
  return leimaustavat[leima1].localeCompare(leimaustavat[leima2], "fi", {
    sensitivity: "base",
  });
}
*/

/**
 * Apufunktio, joka vertailee joukkeuiden sarjojen nimiä.
 *
 * @param {*} joukkue1
 * @param {*} joukkue2
 * @returns -1, 0 tai 1
 */
function compareSarja(joukkue1, joukkue2) {
  if (joukkue1.sarja.nimi < joukkue2.sarja.nimi) {
    return -1;
  }
  if (joukkue1.sarja.nimi > joukkue2.sarja.nimi) {
    return 1;
  }
  return 0;
}

/**
 * Apumetodi, joka vertailee joukkueiden nimiä ja palauttaa ne aakkosjärjestyksessä.
 *
 * @param {String} key1
 * @param {String} key2
 * @returns Taulukko aakkosjärjestyksessä.
 */
function sortTeams(key1, key2) {
  return key1.nimi.localeCompare(key2.nimi, "fi", { sensitivity: "base" });
}

/**
 * Apumetodi, joka vertailee joukkueiden aikoja.
 * @param {String} aika1
 * @param {String} aika2
 * @returns  Palauttaa pienemmän ajan.
 */
function sortTime(aika1, aika2) {
  return aika1.aika.localeCompare(aika2.aika);
}

/**
 * Taso 5
 * Laskee joukkueen kulkeman matkan. Matka tallennetaan joukkue.matka-ominaisuuteen liukulukuna
 * Laske kuinka pitkän matkan kukin joukkue on kulkenut eli laske kunkin rastivälin
 * pituus ja laske yhteen kunkin joukkueen kulkemat rastivälit. Jos rastille ei löydy
 * sijaintitietoa (lat ja lon), niin kyseistä rastia ei lasketa matkaan mukaan.
 *
 * Matka lasketaan viimeisestä LAHTO-rastilla tehdystä leimauksesta alkaen aina
 * ensimmäiseen MAALI-rastilla tehtyyn leimaukseen asti. Leimauksia jotka tehdään
 * ennen lähtöleimausta tai maalileimauksen jälkeen ei huomioida.
 * Käytä annettua apufunktiota getDistanceFromLatLonInKm
 * @param {Object} joukkue
 * @return {Object} joukkue
 */
function laskeMatka(joukkue) {

  let secondLat, secondLon, firstLat, firstLon, midDist, firstDist, index;

  let tulos = 0;

  let duplicates = 0;

  //etäisyys ensimmäisen rastin ja taoisen rastin kanssa
  for (let i = 0; i < joukkue.rastileimaukset.length - 1; i++) {
    if (joukkue.rastileimaukset[i].rasti != null) {
      if (
        joukkue.rastileimaukset[i].rasti.koodi == "LAHTO" &&
        duplicates == 0
      ) {
        duplicates++;
      }

      if (
        joukkue.rastileimaukset[i].rasti.koodi == "LAHTO" &&
        duplicates == 1
      ) {
        firstLat = parseFloat(joukkue.rastileimaukset[i].rasti["lat"]);
        firstLon = parseFloat(joukkue.rastileimaukset[i].rasti["lon"]);

        if (
          joukkue.rastileimaukset[i + 1].rasti.koodi != "LAHTO" &&
          duplicates == 1
        ) {
          index = joukkue.rastileimaukset[i + 1];

          secondLat = parseFloat(joukkue.rastileimaukset[i + 1].rasti["lat"]);
          secondLon = parseFloat(joukkue.rastileimaukset[i + 1].rasti["lon"]);

          // etäisyys ensimmäisen leimauksen ja seuraavan välillä
          tulos = firstDist = getDistanceFromLatLonInKm(
            firstLat,
            firstLon,
            secondLat,
            secondLon
          );

          duplicates++;
        }
      }
    }

    if (
      joukkue.rastileimaukset[i].rasti != null &&
      joukkue.rastileimaukset[i].rasti.koodi != "MAALI"
    ) {
      firstLat = secondLat;
      firstLon = secondLon;
    }
    if (
      joukkue.rastileimaukset[i + 1].rasti != null &&
      joukkue.rastileimaukset[i + 1].rasti.koodi != "MAALI"
    ) {
      secondLat = parseFloat(joukkue.rastileimaukset[i + 1].rasti["lat"]);
      secondLon = parseFloat(joukkue.rastileimaukset[i + 1].rasti["lon"]);
    }
    midDist = getDistanceFromLatLonInKm(
      firstLat,
      firstLon,
      secondLat,
      secondLon
    );
  }
 joukkue.matka = Math.round(tulos*100)/100;

  return joukkue;
}

/**
 * Apufunktio, joka laskee mitäkin koodia on taulukossa.
 *
 * @param {*} joukkue
 * @param {*} koodi
 * @returns määrän.
 */
function montakoKoodia(joukkue, koodi) {
  let count = 0;

  joukkue.rastileimaukset.forEach((leimaus) => {
    if (leimaus?.rasti?.koodi == koodi) {
      count++;
    }
  });
  return count;
}

/**
 * Taso 5
 * Laskee joukkueen saamat pisteet. Pistemäärä tallennetaan joukkue.pisteet-ominaisuuteen
 * Joukkue saa kustakin rastista pisteitä rastin koodin ensimmäisen merkin
 * verran. Jos rastin koodi on 9A, niin joukkue saa yhdeksän (9) pistettä. Jos rastin
 * koodin ensimmäinen merkki ei ole kokonaisluku, niin kyseisestä rastista saa nolla
 * (0) pistettä. Esim. rasteista LÄHTÖ ja F saa 0 pistettä.
 * Samasta rastista voi sama joukkue saada pisteitä vain yhden kerran. Jos
 * joukkue on leimannut saman rastin useampaan kertaan lasketaan kyseinen rasti
 * mukaan pisteisiin vain yhden kerran.
 * Rastileimauksia, jotka tehdään ennen lähtöleimausta tai maalileimauksen jälkeen, ei
 * huomioida.
 * Maalileimausta ei huomioida kuin vasta lähtöleimauksen jälkeen.
 * Jos joukkueella on useampi lähtöleimaus, niin pisteet lasketaan vasta
 * viimeisen lähtöleimauksen jälkeisistä rastileimauksista.
 * Joukkue, jolla ei ole ollenkaan rastileimauksia, saa 0 pistettä
 * @param {Object} joukkue
 * @return {Object} joukkue
 */
function laskePisteet(joukkue) {
  return joukkue;
}

// apufunktioita tasolle 5
/**
 * Laskee kahden pisteen välisen etäisyyden
 */
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  let R = 6371; // Radius of the earth in km
  let dLat = deg2rad(lat2 - lat1); // deg2rad below
  let dLon = deg2rad(lon2 - lon1);
  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c; // Distance in km
  return d;
}
/**
   Muuntaa asteet radiaaneiksi
  */
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
