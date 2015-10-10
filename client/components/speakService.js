'use strict';

angular.module('alarmcontrolApp')
  .factory('speakService', function(){
  		return {
  			talk: function(termino, text){

			//$("#sonido").attr("src", URL).get(0).play();
			//http://www.moreawesomeweb.com/demos/computer_speak.js?2014
			//view-source:http://www.moreawesomeweb.com/demos/speech_translate.html
			//https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#dfn-ttsgetvoices
			//https://www.youtube.com/watch?t=2113&v=N_wTBKMuJis

				// chrome TTS
				var u = new SpeechSynthesisUtterance();
			     u.text = termino + " "+text;
			     u.lang = 'es-ES';
			     u.rate = 1.1;
			     //u.onend = function(event) { console.log('Terminado !!'); }
			     speechSynthesis.speak(u);
console.log("habla");
  			}
  		}
  });