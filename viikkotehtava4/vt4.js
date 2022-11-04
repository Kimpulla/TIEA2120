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
  for (let i = 0; i < 1; i++){
      
      createBalk();

      // Etsitään palkit luokan perusteella
      let balks = document.getElementsByClassName("balks");
      let balk = balks[i];

      // Delayn säätöä palkkien välillä.
      delay = delay + 0.13;
      let str = "" + delay + "s";
      balk.style.animationDelay = str;

      // Kuuntelija palkeille.
      balk.addEventListener("animationiteration",functionality);
    }
 };   


function createBalk(){

    /* Luodaan svg-elementti */
    let base = document.createElementNS("http://www.w3.org/2000/svg",'svg');

    /* Asetetaan elementille attribuutit */
    base.setAttribute('width','100%');
    base.setAttribute('height','100%');
    base.setAttribute('xmlns','http://www.w3.org/2000/svg');
    base.setAttribute('class','balks');

    /* Liitetään elementti html:ään */
    document.body.appendChild(base);

    /* luodaan defs -ja lineaari gradientti elementit */
    let defs = document.createElementNS("http://www.w3.org/2000/svg",'defs');
    let gradient = document.createElementNS("http://www.w3.org/2000/svg",'linearGradient');

    /* Asetetaan attribuutit */
    gradient.setAttribute('id','gradient');
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
    rect.setAttribute('fill','url(#gradient)');
   // rect.setAttribute('class','colorGradients');

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