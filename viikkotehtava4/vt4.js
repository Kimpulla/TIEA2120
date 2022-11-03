"use strict";
//@ts-check 


window.onload = function() {

    createBalk();
};


function createBalk(){

    /* Luodaan svg-elementti */
    let base = document.createElementNS("http://www.w3.org/2000/svg",'svg');
    /* Asetetaan elementille attribuutit */
    base.setAttribute('width','100%');
    base.setAttribute('height','100%');
    base.setAttribute('xmlns','http://www.w3.org/2000/svg');
    base.setAttribute('class','balks');

    /* Liitetään elementti html:ään. TODO: body?*/
    document.body.appendChild(base);

    /* luodaan defs -ja lineaari gradientti elementit */
    let defs = document.createElementNS("http://www.w3.org/2000/svg",'defs');
    let gradient = document.createElementNS("http://www.w3.org/2000/svg",'linearGradient');
    /* Asetetaan attribuutit */
    gradient.setAttribute('id','gradient1');
    gradient.setAttribute('x1','0%');
    gradient.setAttribute('y1','0%');
    gradient.setAttribute('x2','0%');
    gradient.setAttribute('y2','100%');  
    
    /* Luodaan stop -elementit, joiden avulla säädetään häivettä */
    let stopFirst = document.createElementNS("http://www.w3.org/2000/svg",'stop');
    stopFirst.setAttribute('class','stopFirst');
    stopFirst.setAttribute('offset','0%');

    let stopSecond = document.createElementNS("http://www.w3.org/2000/svg",'stop');
    stopSecond.setAttribute('class','stopSecond');
    stopSecond.setAttribute('offset','50%');

    let stopThird = document.createElementNS("http://www.w3.org/2000/svg",'stop');
    stopThird.setAttribute('class','stopThird');
    stopThird.setAttribute('offset','100%');

    /* luodaan rect-elementti */
    let rect = document.createElementNS("http://www.w3.org/2000/svg",'rect');
    rect.setAttribute('width','100%');
    rect.setAttribute('height','5px');
    rect.setAttribute('fill','url(#gradient1)');
    rect.setAttribute('class','colorGradients');

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