"use strict";
//@ts-check 


window.onload = function() { 

let delay = 0;

function functionality(e){

    let balksClass = e.target;
    /* Etsitään stop elmenteistä keskimmäinen, eli stopSceond */
    let stopSecond = balksClass.firstChild.nextElementSibling.
                     firstChild.firstChild.nextElementSibling;

    let color = stopSecond.getAttribute('class');

    if (color == 'stopSecond'){
        stopSecond.setAttribute('class','stopColor');
    }
     if (color == 'stopColor'){
        stopSecond.setAttribute('class','stopSecond');
    }    
}

/* Luodaan n määrä palkkeja */
    for (let i = 0; i < 10; i++){

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

    let variable = 0;
    
    /* Määritellään pöllö */
    let owl = document.createElement('img');
    owl.src = "http://appro.mit.jyu.fi/tiea2120/vt/vt4/owl.png";
    

    owl.addEventListener("load", function() {
       
        for (let i = 0; i < 16; i++){

            createCanvas(variable,owl);
            variable = variable + 34.5; /* --> Kasvatetaan variablen arvoa --> seuraava pala 34.5px verran eri kohdasta. */
            createCanvas2(variable,owl);
            variable = variable + 34.5;
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
 function createCanvas(variable,owl){

    let canvas = document.createElement('canvas');

    /* Attribuutit canvakselle */
    canvas.setAttribute('class', 'firstCanvas');
    canvas.setAttribute('height','35'); // Yhden pykälän korkeus --> 552/16
    canvas.setAttribute('width', '564');

    canvas.style.top = "calc(50vh + " + variable + "px" + ")";
    canvas.style.top = "calc(21vh + " + variable + "px" + ")";
    
    /* Haetaan canvaksen konteksti, '2d' mahdollistaa 2 ulottisen piirron */
    let drawing = canvas.getContext('2d');
    drawing.drawImage( owl, 0, variable, 564, 35, 0, 0, 564, 35);

    document.body.appendChild(canvas);
}


/**
 * 
 *  Funktio luo canvaksen, johon lisätään pöllö.
 * 
 * @param {Number} variable - muuttuja, joilla säädetään palojen välejä
 * @param {*} owl 
 */
 function createCanvas2(variable,owl){

    let canvas2 = document.createElement('canvas');

    /* Attribuutit canvakselle */
    canvas2.setAttribute('class', 'secondCanvas');
    canvas2.setAttribute('height','35'); // Yhden pykälän korkeus --> 552/16
    canvas2.setAttribute('width', '564');

    canvas2.style.top = "calc(50vh + " + variable + "px" + ")";
    canvas2.style.top = "calc(21vh + " + variable + "px" + ")";

    /* Haetaan canvaksen konteksti, '2d' mahdollistaa 2 ulottisen piirron */
    let drawing = canvas2.getContext('2d');
    drawing.drawImage( owl, 0, variable, 564, 35, 0, 0, 564, 35);

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
    
    /* Luodaan stop -elementit, joiden avulla säädetään häivettä */
    let stopFirst = document.createElementNS("http://www.w3.org/2000/svg",'stop');
    stopFirst.setAttribute('class','stopFirst');
    stopFirst.setAttribute('offset','0%');

    /* stopSecond merkitsevin, koska tämän väriä muutetaan*/
    let stopSecond = document.createElementNS("http://www.w3.org/2000/svg",'stop');
    stopSecond.setAttribute('class','stopSecond');
    stopSecond.setAttribute('offset','50%');

    let stopThird = document.createElementNS("http://www.w3.org/2000/svg",'stop');
    stopThird.setAttribute('class','stopThird');
    stopThird.setAttribute('offset','100%');
    
    /* luodaan rect-elementti */
    let rect = document.createElementNS("http://www.w3.org/2000/svg",'rect');
    rect.setAttribute('width','100%');
    rect.setAttribute('height','5em');
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