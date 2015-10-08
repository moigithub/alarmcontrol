'use strict';

angular.module('alarmcontrolApp')
  .controller('PcCtrl', function ($scope, $http, socket) {

    $scope.ismeridian = true;

    $scope.pc = { pcid:"0", 
      tiempo: 60,       // cuanto tiempo en minutos 
      libre: false,        // pago despues o adelantado 
      tiempoinicio: Date.now(),    // fecha hora de inicio
      precio:1.4,       // cuando se cierra/termina.. cuanto pago?
      nombre:"",         // nombre alternativo al numero del pc
      notas: ""         // algun comentario sobre el pc.. debe, 1 gaseosa x cobrar
      
      ,historico: []
    };

    $scope.timeChanged = false;
    $scope.servertime = new Date(); // default start value
    $scope.pclist = [];
    $scope.listaLlamar ="";


    function calcRemain(pc){
      //crear un campo calculado
      // pa ver cuanto tiempo queda
      // (currentTime - TiempoInicio) en segundos
      pc.van = Math.floor(($scope.servertime - Date.parse(pc.tiempoinicio))/1000/60) ;
      pc.quedan = pc.tiempo-pc.van;
      return pc;
     }

    function quienTermino(pclist){
      return pclist.filter(function(pc){
        // revisar si es libre, y tiempo 0, entonces no incluir
        if(pc.libre && pc.tiempo===0)
          return false;
        return pc.quedan<1;
      }).map(function(pc){
        return pc.pcid;
      }).join(", ");
    }

    /////////////////////////////////////
    //// http GET
    /////////////////////////////////////
    $http.get("/api/pcs").success(setPCList);

    $scope.savePc=savepc;
    $scope.deletePc=deletepc;
    $scope.edit = editpc;
    $scope.terminoTiempo = terminoTiempo;
    $scope.faltaPocoTiempo = faltaPocoTiempo;
    $scope.refreshTime = refreshTime;
    $scope.timechanged = fnTimeChanged;


     /////////////////////////////////////
     // serverTime ticks socket
     /////////////////////////////////////
    // on each tick refresh time remains
    socket.setTimertick( function(timer){
      $scope.servertime = new Date(timer.time);
      //console.log("servertime:::",$scope.servertime );

      // refresh tiempoInicio, unless its user edited
      if(!$scope.timeChanged){
        $scope.pc.tiempoinicio = new Date(timer.time);
        //console.log("time refresh");
      }

      if(Array.isArray($scope.pclist)){
        $scope.pclist = $scope.pclist.map(calcRemain);
      }
      // get listaLlamar
      $scope.listaLlamar = quienTermino($scope.pclist);
    } );

    /////////////////////
    // IMPLEMENTATION
    /////////////////////
    function fnTimeChanged(){
      $scope.timeChanged = true ;
    //  console.log("time changed");
    }

    function refreshTime() {
      $scope.pc.tiempoinicio = $scope.servertime;
    }

    function faltaPocoTiempo(pc){
      if(pc.libre && pc.tiempo===0)
        return false;
      return pc.quedan>0 && pc.quedan<=5;
    }

    function terminoTiempo(pc){
      if(pc.libre && pc.tiempo===0)
        return false;
      return pc.quedan<1;
    }

    function setPCList(data){
      //console.log("pclist",data);

      $scope.pclist = data.map(calcRemain);
      // get listaLlamar
      $scope.listaLlamar = quienTermino($scope.pclist);
    }
    

    function savepc(pcobj){
    	//console.log("saving..", pcobj);
      // remove spaces on id
      pcobj.pcid = pcobj.pcid.trim();

    	$http.post("/api/pcs", pcobj).success(function(pc){
    		//console.log("saved",pc);
    		$scope.pclist= $scope.pclist
          .filter(function(xpc){ return xpc.pcid!==pc.pcid});

        $scope.pclist.push(calcRemain(pc));


        // set default pc data
    		$scope.pc = { pcid:"0", 
              tiempo: 60,       // cuanto tiempo en minutos 
              libre: false,        // pago despues o adelantado 
              tiempoinicio: new Date(),    // fecha hora de inicio
              precio:1.4,       // cuando se cierra/termina.. cuanto pago?
              nombre:"",         // nombre alternativo al numero del pc
              notas: "",         // algun comentario sobre el pc.. debe, 1 gaseosa x cobrar
              historico: []
            };

        //reset timeChanged
        $scope.timeChanged = false;

    	}).error(function(data){
            console.log("error", data);
        });
    }

    function editpc(pcobj){
        //$scope.pc = pcobj;  // this make a direct bind , i dont want that
        $scope.pc = { pcid:pcobj.pcid, 
              tiempo: pcobj.tiempo,       // cuanto tiempo en minutos 
              libre: pcobj.libre,        // pago despues o adelantado 
              tiempoinicio: pcobj.tiempoinicio,    // fecha hora de inicio
              precio:pcobj.precio,       // cuando se cierra/termina.. cuanto pago?
              nombre:pcobj.nombre,         // nombre alternativo al numero del pc
              notas: pcobj.notas,         // algun comentario sobre el pc.. debe, 1 gaseosa x cobrar
              historico:pcobj.historico
            };
        $scope.timeChanged = true ;
    }


    function deletepc(pcobj){
    	//console.log("deleting", pcobj);
    	$http.delete("/api/pcs/"+pcobj._id).success(function(data){
    		//console.log("delete result", data);
    		$scope.pclist=$scope.pclist.filter(function(pc){
    			//console.log("scaning",pc,data);
    			return pc._id !== pcobj._id;
    		});

        // get listaLlamar
        $scope.listaLlamar = quienTermino($scope.pclist);
    	}).error(function(data){
            console.log("delete error", data);
        });
    }

  })


/*
.directive("cuadroAlquiler", function () {
  return {
    restrict: "E",
    scope: {
        
    },
    fun: "&",
    pc: "="
    templateUrl: "cuadro.html", 
    link: function(scope, element, attrs){
        // all of this can easily be done with a filter, but i understand you just want to     
        // know how it works
        scope.formattedText = scope.pos.Name + ' (' + scope.pos.Code + ')';
    }
  }
})
*/

;