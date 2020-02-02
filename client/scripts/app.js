var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var MSG_TO_SEND = "";

var synth = window.speechSynthesis;
var inputForm = document.querySelector('form');
var inputTxt = document.querySelector('.txt');

var voiceSelect = document.querySelector('#voice-select');

var pitch = document.querySelector('#pitch');
var pitchValue = document.querySelector('#pitch-value');
var rate = document.querySelector('#rate');
var rateValue = 1;

var voices = [];


function populateVoiceList() {
  voices = synth.getVoices().sort(function (a, b) {
      const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
      if ( aname < bname ) return -1;
      else if ( aname == bname ) return 0;
      else return +1;
  });
  var selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
  voiceSelect.innerHTML = '';
  for(i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    
    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
  voiceSelect.selectedIndex = selectedIndex;
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

function speak(){
    if (synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }
    if (inputTxt.value !== '') {
    var utterThis = new SpeechSynthesisUtterance(inputTxt.value);
    utterThis.onend = function (event) {
        console.log('SpeechSynthesisUtterance.onend');
    }
    utterThis.onerror = function (event) {
        console.error('SpeechSynthesisUtterance.onerror');
    }
    var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    for(i = 0; i < voices.length ; i++) {
      if(voices[i].name === selectedOption) {
        utterThis.voice = voices[i];
        break;
      }
    }
    utterThis.pitch = pitch.value;
    utterThis.rate = rate.value;
    synth.speak(utterThis);
  }
}
  
pitchValue.onchange = function() {
  pitchValue.textContent = pitch.value;
}

voiceSelect.onchange = function(){
  console.log(voiceSelect.selectedIndex);
}













function testSpeech() {
    var grammar = "ok";
    var recognition = new SpeechRecognition();
    var speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  
    recognition.start();
  
    recognition.onresult = function(event) {
      var speechResult = event.results[0][0].transcript.toLowerCase();
      if (speechResult != "") {
        $("#test").append("<p>" + speechResult + "</p>");
        MSG_TO_SEND = speechResult;
        var msg = {
            voiceIndex: voiceSelect.selectedIndex,
            pitch: pitchValue.value,
            rate: 1,
            msg: MSG_TO_SEND
        };
        sendClientMsg(msg);
      }
    }
  
    recognition.onspeechend = function() {
      recognition.stop();
    }
  
    recognition.onerror = function(event) {
    //   console.log('Error occurred in recognition: ' + event.error);
    }
    
    recognition.onaudiostart = function(event) {
        //Fired when the user agent has started to capture audio.
        console.log('SpeechRecognition.onaudiostart');
    }
    
    recognition.onaudioend = function(event) {
        //Fired when the user agent has finished capturing audio.
        // console.log('SpeechRecognition.onaudioend');
    }
    
    recognition.onend = function(event) {
        //Fired when the speech recognition service has disconnected.
        console.log('SpeechRecognition.onend');
        messageToSend = "";
        testSpeech();
    }
    
    recognition.onnomatch = function(event) {
        //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
        // console.log('SpeechRecognition.onnomatch');
    }
    
    recognition.onsoundstart = function(event) {
        //Fired when any sound — recognisable speech or not — has been detected.
        // console.log('SpeechRecognition.onsoundstart');
    }
    
    recognition.onsoundend = function(event) {
        //Fired when any sound — recognisable speech or not — has stopped being detected.
        // console.log('SpeechRecognition.onsoundend');
    }
    
    recognition.onspeechstart = function (event) {
        //Fired when sound that is recognised by the speech recognition service as speech has been detected.
        // console.log('SpeechRecognition.onspeechstart');
    }
    recognition.onstart = function(event) {
        //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
        //console.log('SpeechRecognition.onstart');
    }
 }



var sendClientMsg = (msg) => {
    $.ajax({
        type: "POST",
        url: "/api/sendClientMsg",
        data: {"msg": msg},
        success: () => {
            console.log("Msg sent: ", + MSG_TO_SEND + "\r\n");
        },
        error: (request, status, error) => {
            console.log("Error: " + error);
        },
        dataType: "text"
    });
};





















/*
 *  
 *  
 *  
 *  
 *  Document.ready funcs
 *  
 *  
 *  
 *  
 *  
 */
$(document).ready(() => {
    testSpeech();
});