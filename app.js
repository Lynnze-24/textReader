const display = document.querySelector('.reader-display textarea')
const speed = document.querySelector('.number-input input')
const arrows = document.querySelector('.arrows');
const readBtn = document.querySelector('.reader-controls button:nth-of-type(1)');
const pauseBtn = document.querySelector('.reader-controls button:nth-of-type(2)');
const stopBtn = document.querySelector('.reader-controls button:nth-of-type(3)');
const voiceBtn = document.querySelector('.reader-controls select');


speed.value = 1;
inputHeight();
window.onresize = inputHeight;

arrows.children[0].addEventListener('click',speedUp);
arrows.children[1].addEventListener('click',speedDown);
let loading = false;


const synth = window.speechSynthesis;
let  utter; 



// if(synth.getVoices().length > 1){
//   voiceBtn.classList.remove('hide')
//   utter.voice =synth.getVoices()[voice];
// }




let voiceArr;
let paused = false;

addEventListener('DOMContentLoaded',()=> {
  readBtn.addEventListener('click',readText)
speed.addEventListener('change',changeRate)
voiceBtn.addEventListener('change',changeVoice)
pauseBtn.addEventListener('click', pauseUtter);
stopBtn.addEventListener('click',stopUtter)
utter = new SpeechSynthesisUtterance();

  utter.onstart = () => console.log('On start');
    utter.onpause = () => {
      paused = true;
      console.log('On pause');
    }
    utter.onresume = () => {
      paused = false;
      console.log('On resume');
    }
    utter.onend = () => {
      paused = false;
      console.log('On end');
    }
    utter.onerror = (err) => {
      console.log(err);
      paused = false;
      if(synth.speaking) stopUtter()
    }

  bindVoices()
})
synth.addEventListener("voiceschanged", bindVoices);

function bindVoices(){
  if(synth?.speaking)stopUtter()
  
  
    voiceArr = synth.getVoices();
  let selectCon = document.querySelector('.select select')
  selectCon.innerHTML = ''
  voiceArr.forEach((v,i)=> {
    selectCon.innerHTML += `<option value="${i}">${v.name}</option>`
  })
  if(voiceArr.length)checkAvailablePause(voiceArr[0])
  utter.voice =voiceArr[0];
  console.log(synth.getVoices())
}


function checkAvailablePause(v){
  if(v.name.toLowerCase().includes('microsoft')){
    pauseBtn.classList.remove('disabledControl')
  }else{
    pauseBtn.classList.add('disabledControl')
  }
}



function stopUtter(){

  paused = false;
  synth.cancel();

}

function pauseUtter(){
    synth.pause();
  console.log(synth,'paused')
}


function changeVoice(){
  if(voiceArr.length)checkAvailablePause(voiceArr[voiceBtn.value])
 utter.voice =voiceArr[voiceBtn.value];
}





async function readText(){
 console.log(synth,'readText')
  if(synth.speaking && !synth.paused) {
    console.log('cancel')
    synth.cancel()
  }
  
  if(synth.paused || paused){
    synth.resume();
    paused = false;
    console.log('resumed')
  }else{
    utter.text = display.value;
    changeRate();
     // utter.lang ='my';
     synth.speak(utter);
     console.log('read',synth)
  
  }
 
}

function changeRate(){
  utter.rate = speed.value;
  if (speed.value<0){
    utter.rate = (10 - Math.abs(speed.value))/10;
  }
  
  
}



function speedUp(){
  if(speed.value!='10'){
    speed.value =Number(speed.value) +1;
  }
  
  changeRate()
}

function speedDown(){
  if(speed.value!='-9'){
    speed.value =Number(speed.value)- 1;
  }
  
  
  changeRate()
}


function inputHeight(){
  arrows.style.height =speed.getBoundingClientRect().height + 'px';
   
}