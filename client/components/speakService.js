'use strict';

angular.module('alarmcontrolApp')
  .factory('SoundService', function($http){ // deberia llamarse SoundService
  		return {
  			talk: function(termino, text){

				//$("#sonido").attr("src", URL).get(0).play();
				//http://www.moreawesomeweb.com/demos/computer_speak.js?2014
				//view-source:http://www.moreawesomeweb.com/demos/speech_translate.html
				//https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#dfn-ttsgetvoices
				//https://www.youtube.com/watch?t=2113&v=N_wTBKMuJis
				console.log(window.SpeechSynthesisUtterance);

				if(window.SpeechSynthesisUtterance !== undefined){
					// chrome TTS
					var u = new SpeechSynthesisUtterance();
				     u.text = termino + " "+text;
				     u.lang = 'es-ES';
				     u.rate = 1.1;
				     //u.onend = function(event) { console.log('Terminado !!'); }
				     speechSynthesis.speak(u);
				 } else {
				 	var text = termino + " "+ text; 
				 	var url = "https://translate.google.com/translate_tts?ie=UTF-8&tl=es-ES&client=web&q="+encodeURI(text);

				    
				 }
	//console.log("habla");
  			},

  			beep: function(){
  				/*
  				var sonido = new Audio('/assert/boing.mp3');
  				sonido.currentTime=0;
  				sonido.play();

  				*/
  				var a= $('#beep').get(0);
  				//a.volume = 0.2;
  				if (a) {
  					a.play();
  				}
  			}
  		}
  });