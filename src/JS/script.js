// GLOBAL VARIABLES:  //////////////////////////////////////////////////////////////////////////
//
// radius: The variable "radius" representa el radio del circulo de los splices.
//
// autoRotate: The variable "autoRotate" representa un valor boolean, si gira (true) o no (false) automaticamente.
//
// rotateSpeed: representa la velocidad de giro de los splices. Toma como unidad: seconds/360grad.
//
// Dimensiones de los splices: images or videos (en px). Warum? warum nicht?
//
// imgWidth  (in px)
// imgHeight (in px)
//  
//

//  DIMENSIONS (unit: px) ////////////////////////////////////
let radius    = 460; // How big of the radius (unit: px). 
let imgWidth  = 200; // width  of images      (unit: px)
let imgHeight = 260; // height of images      (unit: px)

//  TIMES  (unit: seg and mseg) ////////////////////////////////////////
let autoRotate  = true;   // auto rotate or not (boolean)
let rotateSpeed = 15;    // velocity of rotate of Splice (unit: seconds/360 degrees)
let delayTime   = 1;    // (unit: mseg)
let timeDelayProgram = 1200;  // delay of the program (unit: mseg)

/*  ACHTUNG !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     NOTE:
       + imgWidth, imgHeight will work for video.
       + if imgWidth, imgHeight too small, play/pause button in <video> will be hidden
*/
//////////////////////////////////////////////////////////////////////////////////////////////////
// MUSIC OF BACKGROUND  /////////////////////////////////////////////////////////////////////////
// Link of background music - set 'null' if you dont want to play background music
let bgMusicURL = 'assets/Music/StarTrekVoyagerThema.mp3';  // QUELLE MUSIK LOCAL
let bgMusicControls = true; // Show UI music control.

// Add background music:
if (bgMusicURL) {
  document.querySelector('.containerMusic').innerHTML += `
    <audio src="${bgMusicURL}" ${bgMusicControls? 'controls': ''} autoplay loop preload="auto">    
      <p>If you are reading this, it is because your browser does not support the audio element.</p>
      <p> Tut mir es leid ;-§ </p>
    </audio>`;
}

// STAR PROGRAMM  //////////////////////////////////////////////////////////////////////
// VARIABLES GENERALL OF PROGRAMM  //////////////////////////////////////////
const varContainerCentral = document.getElementsByClassName('containerCentral'); 
const varSpin = document.getElementById('idimgSpinSlice');  // Spin of Slice Element.

let aImg = varSpin.getElementsByTagName('img');       // Das Bild
let aVid = varSpin.getElementsByTagName('video');     // Das Video

let aEle = [...aImg, ...aVid]; // Combine 2 arrays (concat of array  == aImg.concat(aVid);)
// console.log('combinacion de arrays de imagen y video: aEle: ' + aEle );

// Size of images igual global initialization.
varSpin.style.width  = imgWidth  + "px";
varSpin.style.height = imgHeight + "px";

//////////////  VARIABLES OF THE CAMERA  ////////////////////////////
let sX, sY, nX, nY, desX = 0,
    desY = 0,
    tX =   0,
    tY =  30;

////////////////  CONTROL OD THE CENTRAL ANIMATION  ///////////////////
let yes;
varSpin.addEventListener('click', () => {
  if (autoRotate) {
    autoRotate = false;
    playSpin(false)
  } else {
    autoRotate = true;
    playSpin(true)
  }
  // yes = autoRotate;
  // console.log(' autoRotate: ' + autoRotate);
  // console.log(' yes: ' + yes);
});

//  PROGRAM  //////////////////////////////////////////////////////////////////////////////
setTimeout(init(), timeDelayProgram);// animation start after timeDelayProgram miliseconds.

// Size of ground - depend on radius!!
let ground = document.getElementById('ground');
ground.style.width  = radius * 4.5 + "px";
ground.style.height = radius * 4.5 + "px";

//  FUNCTION "init" ("delayTime"   DE DONDE SALE Y DONDE SE LLAMA????)
function init() {
  console.log('delayTime: ' + delayTime);

  for (let i = 0; i < aEle.length; i++) {
    aEle[i].style.transition = "transform 1s linear";
    aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
    aEle[i].style.transform  = "rotateY(" + (i * (360 / aEle.length)) + "deg) translateZ(" + radius + "px)";
  }
}

//  FUNCTION APPLYTRANSFORM  MOVE THE split MIT THE MOUSE
function applyTranform(obj) {
  // Constrain the angle of camera (between 0 and 180)
  if(tY > 180) tY = 180;
  if(tY < 0)   tY =   0;

  // Apply the angle of camera
  varSpin.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)";
  console.log(`"rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)";`);
}

function playSpin(yes) {
    if(yes === true) {
      varSpin.style.animationPlayState = 'running';
    } else {
      varSpin.style.animationPlayState = 'paused';
    }
    console.log('ANIMACION: ' + varSpin.style.animationPlayState);
}

// auto spin
if (autoRotate) {
  var animationName = (rotateSpeed > 0 ? 'spin' : 'spinRevert');
  varSpin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite alternate linear`;
}

// SETUP OF THE EVENTS  /////////////////////////////////////////////////////////////////////////
document.onpointerdown = function (e) {
  clearInterval(varContainerCentral.timer);
  e = e || window.event;
  var sX = e.clientX,
      sY = e.clientY;

  this.onpointermove = function (e) {
    e = e || window.event;
    var nX = e.clientX,
        nY = e.clientY;
    desX = nX - sX;
    desY = nY - sY;
    tX += desX * 0.1;
    tY += desY * 0.1;
    applyTranform(varContainerCentral);
    sX = nX;
    sY = nY;
  };

  this.onpointerup = function (e) {
    varContainerCentral.timer = setInterval(function () {
      desX *= 0.95;
      desY *= 0.95;
      tX += desX * 0.1;
      tY += desY * 0.1;
      applyTranform(varContainerCentral);
      playSpin(false);
      if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
        clearInterval(varContainerCentral.timer);
        playSpin(true);
      }
    }, 17);
    this.onpointermove = this.onpointerup = null;
  };

  return false;
};

document.onmousewheel = function(e) {
  e = e || window.event;
  var d = e.wheelDelta / 20 || -e.detail;
  radius += d;
  init(1);
};
