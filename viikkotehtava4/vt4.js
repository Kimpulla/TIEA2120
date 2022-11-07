"use strict";
//@ts-check 


window.onload = function() { 

/* delay muuttuja viivästää palkkeja. */
let delay = 0;

/* Annettu väritaulukko */
let colors = ["#ff0000", "#00ff00", "#0000ff", "#ff00ff", "#ffff00","#00ff00", "#00ffff", "#ffffff"];

/* Uusi väritaulukko, johon jokaiselle palkille väri, eli ["#ff0000" x n, "#00ff00" x n, ..]*/
let colorArray = []; 

function functionality(e){

    let balksClass = e.target;

    /* Etsitään stop elmenteistä keskimmäinen, eli stopSceond */
    let change = balksClass.getElementsByClassName('stopSecond')[0];

        let last = colorArray.pop();
        colorArray.unshift(last);
        change.style.stopColor = last;
}

/* Muuttuja n on tulevien palkkien lukumäärä. */
let n = 10;

    while(colors.length >= 1){

        let first = colors.shift();

    for (let i = 0; i < n; i++){
        colorArray.push(first);
        console.log(colorArray);
    }
    }

    /* Luodaan n määrä palkkeja */
    for (let i = 0; i < n; i++){

        let pcs = i; /* Luodaan uniikki pääte palkin id:lle. Esim gradient1, gradient2.. */
        
        createBalk('' + pcs);

        /* Etsitään palkit luokan perusteella*/
        let balks = document.getElementsByClassName("balks");
        let balk = balks[i];

        /* Delayn säätöä palkkien välillä. */
        delay = delay + 0.19;
        balk.style.animationDelay = delay + "s";

        /* Tapahtuman kuuntelija palkille */
        balk.addEventListener("animationiteration",functionality);
    }
    /* Kutsutaan funktioita */
    drawOwl();
    button();   
};


function slider(){

    let pHeight = window.innerHeight;

    let slider = document.createElement('range');
    slider.setAttribute('min', pHeight * 1.01);
    slider.setAttribute('max', pHeight * 1.5);

    document.appendChild(slider);
}

/**
 * Funktio luo uuden pingviinin napin klikkauksen yhteydessä.
 */
function button(){

/* Luodaan button -elementti */
let button = document.createElement('button');

/* Lisätään buttonille attribuutit */
button.textContent = "lisaa pingviini";
button.setAttribute('id','button');


document.body.appendChild(button);
button.addEventListener('click', createPenquin);
}

/**
 *  Funktiolla "piirretään" pöllö ruutuun. 
 */
function drawOwl(){

    let variableY = 0;
    let locationOnScreen = window.innerHeight / 2 - 564 / 2;


    /* Määritellään pöllö */
    let owl = document.createElement('img');
    owl.src = "http://appro.mit.jyu.fi/tiea2120/vt/vt4/owl.png";
    

    owl.addEventListener("load", function() {
       
        for (let i = 0; i < 16; i++){

            createCanvas(variableY,owl,locationOnScreen);
            variableY = variableY + 34.5; /* --> Kasvatetaan variablen arvoa --> seuraava pala 34.5px verran eri kohdasta. */
            locationOnScreen = locationOnScreen + 34.5;
            
            createCanvas2(variableY,owl,locationOnScreen);
            variableY = variableY + 34.5;
            locationOnScreen = locationOnScreen + 34.5;
        }
    });

}

/**
 * 
 *  Funktio luo canvaksen, johon lisätään pöllö.
 * 
 * @param {Number} variable - muuttuja, joilla säädetään palojen välejä
 * @param {*} owl 
 */
 function createCanvas(variableY,owl,locationOnScreen){

    let canvas = document.createElement('canvas');

    /* Attribuutit canvakselle */
    canvas.setAttribute('class', 'firstCanvas');
    canvas.setAttribute('height','35'); // Yhden pykälän korkeus --> 552/16 (34.5 pyöristetty)
    canvas.setAttribute('width', '564');

    /* Mistä kohtaa pöllön piirto alkaa ruudulla: */
    canvas.style.top = locationOnScreen + "px";

    /* Haetaan canvaksen konteksti, '2d' mahdollistaa 2 ulotteisen piirron */
    let drawing = canvas.getContext('2d');
    /* image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight */
    drawing.drawImage(owl, 0, variableY, 564, 35, 0, 0, 564, 35);

    document.body.appendChild(canvas);
}


/**
 * 
 *  Funktio luo canvaksen, johon lisätään pöllö.
 * 
 * @param {Number} variable - muuttuja, joilla säädetään palojen välejä
 * @param {*} owl 
 */
 function createCanvas2(variableY,owl,locationOnScreen){

    let canvas2 = document.createElement('canvas');

    /* Attribuutit canvakselle */
    canvas2.setAttribute('class', 'secondCanvas');
    canvas2.setAttribute('height','35'); // Yhden pykälän korkeus --> 552/16 (34.5 pyöristetty)
    canvas2.setAttribute('width', '564');

    /* Mistä kohtaa pöllön piirto alkaa ruudulla: */
    canvas2.style.top = locationOnScreen + "px";

    /* Haetaan canvaksen konteksti, '2d' mahdollistaa 2 ulottisen piirron */
    let drawing = canvas2.getContext('2d');
    drawing.drawImage( owl, 0, variableY, 564, 35, 0, 0, 564, 35);

    document.body.appendChild(canvas2);
}


/**
 * Funktiolla createPenquin luodaan pingviini.
 */
function createPenquin(){

    /* Luodaan svg-elementti */
    let base = document.createElementNS("http://www.w3.org/2000/svg",'svg');

    /* Asetetaan svg -elementille attribuutit */
    base.setAttribute('width','150px');
    base.setAttribute('height','150px');
    base.setAttribute('width','100%');
    base.setAttribute('height','100%');
    base.setAttribute('xmlns','http://www.w3.org/2000/svg');
    base.setAttribute('class','penquinsBase');

    /* Luodaan image -elementti */ 
    let penquin = document.createElementNS("http://www.w3.org/2000/svg",'image');
    
    /* Lisätään kuvalle attribuutit */
    penquin.setAttribute('href','https://appro.mit.jyu.fi/tiea2120/vt/vt4/penguin.png');
    penquin.setAttribute('class','penquins');
    penquin.setAttribute('height','150px');
    penquin.setAttribute('width','150px');
    base.appendChild(penquin);
    
    /* Liitetään elementti html:ään */
    document.body.appendChild(base);
    
}

/**
 * Funktiolla createBalk luodaan palkki.
 */
function createBalk(pcs){

    /* Luodaan svg-elementti */
    let base = document.createElementNS("http://www.w3.org/2000/svg",'svg');

    /* Asetetaan elementille attribuutit */
    base.setAttribute('width','100%');
    base.setAttribute('height','100%');
    base.setAttribute('xmlns','http://www.w3.org/2000/svg');
    base.setAttribute('class','balks');

    /* luodaan defs -ja lineaari gradientti elementit */
    let defs = document.createElementNS("http://www.w3.org/2000/svg",'defs');
    let gradient = document.createElementNS("http://www.w3.org/2000/svg",'linearGradient');

    /* Asetetaan attribuutit */
    gradient.setAttribute('id','gradient' + pcs);
    gradient.setAttribute('x1','0%');
    gradient.setAttribute('y1','0%');
    gradient.setAttribute('x2','0%');
    gradient.setAttribute('y2','100%');  

    /* Muutetaan basen pituutta, jotta saadaan digonaalipalkit sovitettua näyttöön. */
    base.style.width = window.innerWidth * 2;
    
    /* Luodaan stop -elementit, joiden avulla säädetään häivettä */
    let stopFirst = document.createElementNS("http://www.w3.org/2000/svg",'stop');
    stopFirst.setAttribute('class','stopFirst');
    stopFirst.setAttribute('offset','25%');

    /* stopSecond merkitsevin, koska tämän väriä muutetaan*/
    let stopSecond = document.createElementNS("http://www.w3.org/2000/svg",'stop');
    stopSecond.setAttribute('class','stopSecond');
    stopSecond.setAttribute('offset','50%');

    let stopThird = document.createElementNS("http://www.w3.org/2000/svg",'stop');
    stopThird.setAttribute('class','stopThird');
    stopThird.setAttribute('offset','75%');
    
    /* luodaan rect-elementti */
    let rect = document.createElementNS("http://www.w3.org/2000/svg",'rect');
    rect.setAttribute('width','100%');
    rect.setAttribute('height','10em');
    rect.setAttribute('fill','url(#gradient' + pcs +')');

    /* Liitetään svg -elementti html:ään */
    document.body.appendChild(base);

    /* lisätään rect -elementti basen lapsoseksi */
    base.appendChild(rect);    

    /* Lisätään nyt defs base:n lapsoseksi */
    base.appendChild(defs);

    /* Lisätään nyt gradient defs:n lapsoseksi */
    defs.appendChild(gradient);

    /* Lisätään nyt stopit gradientin lapsosiksi */
    gradient.appendChild(stopFirst);
    gradient.appendChild(stopSecond);
    gradient.appendChild(stopThird); 
}