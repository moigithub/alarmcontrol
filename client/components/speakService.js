'use strict';

angular.module('alarmcontrolApp')
  .factory('speakService', function(){
  		return {
  			talk: function(text){
  				var URL = "http://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=t&q="+encodeURI(text);
  				console.log(URL,text);
  				/*
  				var sonido = angular.element('#sonido');
  				sonido.$set("src",URL);
  				sonido.$set("loop", true);
  				sonido.$set("currentTime", 0);
				sonido.play();
				*/

				//$("#sonido").attr("src", URL).get(0).play();
  			}
  		}
  });