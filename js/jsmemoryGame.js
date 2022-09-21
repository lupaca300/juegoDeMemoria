
window.onload = displayCards

var totales = [];
var numbersRandom = [];
var ubicacionesCards = new Map();
const numFilasAndColumn=sessionStorage.getItem('amountCards');
const numQuantCards=(numFilasAndColumn*numFilasAndColumn)/2;
var limite = numQuantCards-1;
var numCardsDisnponibles=32;
var cartasVolteadas=0;
var Horainit=new Date();
var init=new Date();
var numIntentosRealizados=0;
function displayCards() {


    generateIndiceCards(numQuantCards);
    agregarTodasLasCartas(numFilasAndColumn);
    setCssInCards();
    agregarFunctionGiroCard();

}

function agregarTodasLasCartas(quant) {
   
    // end numero de cartas
    let initCards = 1;
    let contentPlay = document.getElementById('contentPlay');
    
    let i = 0;
    for (let m = 0; m < quant; m++) {
        contentPlay.innerHTML += `<div class="contentCards" id="contentCards${m}"> </div>`;
        if (initCards > 8) {
            initCards = 1;
        }
        while (i < quant) {
            let numImagen = numRandom(limite, 0);
            let numeroOfCard = numbersRandom[numImagen].numero;
            aumentarCountSingleCard(numImagen);
            ubicacionesCards.set(`card${m}${i}`, numeroOfCard);
            let divContentCards = document.getElementById(`contentCards${m}`);
            divContentCards.innerHTML += `
            <div class="divC">
            <div class="div1" id="card${m}${i}"><img  src="./imagenes/pokemones/imagen(0).jpg" width="140px" height="200px"></div>
            <div class="div2"><img src="./imagenes/pokemones/imagen(${numeroOfCard}).jpg" width="140px" height="200px"></div>
            </div>
            `;
            ++i
            ++initCards
        }

        i = 0;
    }
}

function aumentarCountSingleCard(numVerificar) {
    numbersRandom[numVerificar].cant++
    if (numbersRandom[numVerificar].cant == 2) {

        quitarElementoOfNumbersRandom(numVerificar);
    }
}

function quitarElementoOfNumbersRandom(numQuitar) {
    numbersRandom.splice(numQuitar, 1);
    limite--;
}

function generateIndiceCards(num) {

    if(num==32){
        //comenzamos en 1 , por que 0 es para la portada
        for(let i=1;i<=32;i++){
            numbersRandom[i-1]={'numero':i,'cant':0};
        }
        return;
    }
    let indicesSet = new Set();
    while (true) {
        console.log('genernado indices')
        console.log(indicesSet.size)
        //total de cartas que tenemos es 32
        let numR = numRandom(numCardsDisnponibles, 1);
        indicesSet.add(numR)

        if (indicesSet.size == num) {
            break;
        }
    }
    numbersRandom = [...indicesSet].map((value) => { return { 'numero': value, 'cant': 0 } });

}

function numRandom(max, min) {
    if (max <= min) {
        let aux = max;
        max = min;
        min = aux;
    }
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function agregarFunctionGiroCard() {
    let cardsAll = document.querySelectorAll('.div1');
    for (let i = 0; i < cardsAll.length; i++) {
        cardsAll[i].addEventListener('click', girarCarta);
    }
}
    function girarCarta(evento) {
    let id = evento.path[1].id;
   
    if(id==totales[totales.length-1]){
        return;
    }

    let actualCard = document.querySelector(`#${id}`)
    let padre=actualCard.parentNode
    totales[totales.length] = id;
    let indice=totales.length;
    padre.className = 'divC'
    animationGiro(padre);
    comprobarCartas(indice);
    
}
function animationGiro(padre){
    let g=padre;
    return new Promise((resolve)=>{
        resolve('echo')
        window.requestAnimationFrame(function () {
            
            window.requestAnimationFrame(function () {
              
            g.className = "divC changing";
            });
        
        });

    });
}

function comprobarCartas(indice) {
    console.log('estamos eon conbr')
    if (indice % 2 == 0) {
        incrementarIntentosRealizados();
        let aux1 = totales[indice - 1];
        let aux2 = totales[indice - 2];
        comprobarSiSonIguales(aux1, aux2);
    }
}

function incrementarIntentosRealizados(){
    numIntentosRealizados+=1;
}
function comprobarSiSonIguales(idnum1, idnum2) {

    let id1 = ubicacionesCards.get(idnum1);
    let id2 = ubicacionesCards.get(idnum2);
    if (id1 == id2) {
        ++cartasVolteadas;
        removeEvent(idnum1, idnum2)
        ComprobarFinalizadoJuego();    
    } else {

    }
}
function ComprobarFinalizadoJuego(){
    if(cartasVolteadas==numQuantCards){
        document.getElementById("modal").style.visibility="visible";
        tt=tiempoTotalJugado();
        document.getElementById("tiempoTotal").innerHTML=tt[0]+" : "+tt[1];
        document.getElementById("numeroDeVecesIntentado").innerHTML=intentosRealizados();
    }
}

function intentosRealizados(){
    return numIntentosRealizados;
}

function tiempoTotalJugado(){


    let horaFinish=new Date();
    let min=horaFinish.getMinutes()-Horainit.getMinutes();
    
    if(min>=10){
        let num10=10;
        return [num10.toString(),'00'];
    } else{
        let sec=horaFinish.getSeconds()-Horainit.getSeconds();
        if(sec<0){
            secOfInit=60-Horainit.getSeconds();
            secOfFinish=horaFinish.getSeconds();
            secFinal=secOfFinish+secOfInit;
            
            if(min<0){
        
                min=(60-Horainit.getMinutes()+horaFinish.getMinutes()-1);
        
            }
            return [min.toString(),secFinal.toString()];
    
        }else if(sec==0){
            if(min<0){
        
        min=(60-Horainit.getMinutes()+horaFinish.getMinutes());
    
    }
            return [min.toString(),'00'];
        }else {
            if(min<0){
        
        min=(60-Horainit.getMinutes()+horaFinish.getMinutes()+1);
    
    }
            return [min.toString(),sec.toString()];
        }
    }
    

}
function removeEvent(id1, id2) {
    let removeID1 = document.querySelector(`#${id1}`);
    let removeID2 = document.querySelector(`#${id2}`);
    removeID1.removeEventListener('click', girarCarta, false);
    removeID2.removeEventListener('click', girarCarta, false);

    // document.getElementById(removeID1).style.transform="rotateY(180deg)";
    removeID1.parentNode.style.transform="rotateY(180deg)";
    removeID2.parentNode.style.transform="rotateY(180deg)";


}


function setCssInCards() {
    let card3 = document.getElementsByClassName('divC');
    let j = 0;
    while (j < card3.length) {
        card3[j].style.cssText = valuesCSS();
        j++
    }
}

function valuesCSS() {
   

        let valuesCSS = `    
        background-color: #f1f1f1;
        width:140px;
        height:200px;
        margin: 10px;
        text-align: center;
        font-size: 30px;    
        `;
        return valuesCSS;
    
}

