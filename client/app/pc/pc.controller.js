'use strict';

angular.module('alarmcontrolApp')
  .controller('PcCtrl', function ($scope, $http, socket, speakService) {

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

    var listaPCs = ["0","1","2","3","4","5","6","7","8","9","10"];
    $scope.pcDisponibles = [];

    $scope.selectedPC="0";
    
    $scope.orderPCID = function(pc){
      return parseInt(pc.pcid);
    }
    ////////////////////////
    //// HELPER Functions
    ////////////////////////
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
    $scope.selectPC = selectPC;
    $scope.creaPC = creaPC;

    $scope.esLibre = function(pc){
      return pc.libre && pc.tiempo===0;
    }


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

      // habla si hay alguno que termino
      if ($scope.listaLlamar) {
        speakService.talk("Terminó",$scope.listaLlamar);
      }
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

    function getPCDisponibles(PCs){
      var pcUsadas = PCs.map(function(pc){
        return pc.pcid;
      });
      //console.log("usadas",pcUsadas);
      var pcd = listaPCs.filter(function(num){
        return pcUsadas.indexOf(num)===-1;
      });
      //console.log("disponibles", pcd);
      return pcd;
    }

    function setPCList(data){
      // data comes from $http.GET request
      // console.log("pclist",data);

      $scope.pclist = data.map(calcRemain);
      // get listaLlamar
      $scope.listaLlamar = quienTermino($scope.pclist);

      // build pcDisponibles list
      $scope.pcDisponibles = getPCDisponibles(data);
    }
    
    function creaPC(tiempo, esLibre){
      // set default pc data
        var pc = { pcid:$scope.selectedPC, 
              tiempo: tiempo,       // cuanto tiempo en minutos 
              libre: esLibre,        // pago despues o adelantado 
              tiempoinicio: new Date(),    // fecha hora de inicio
              precio:1.4,       // cuando se cierra/termina.. cuanto pago?
              nombre:"",         // nombre alternativo al numero del pc
              notas: "",         // algun comentario sobre el pc.. debe, 1 gaseosa x cobrar
              historico: []
            };

        // if PC in use... add time
        var pcInUse = $scope.pclist
          .filter(function(xpc){ return xpc.pcid===$scope.selectedPC});

        if(pcInUse.length>0) {
          pc = pcInUse[0];
          pc.tiempo = pcInUse[0].tiempo + tiempo;
          //console.log(pcInUse);
        }

        // call savePC pass new data
        savepc(pc);
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


        // build pcDisponibles list
        $scope.pcDisponibles = getPCDisponibles($scope.pclist);

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

    function selectPC(pcID) {
      $scope.selectedPC=pcID;
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

        $scope.selectedPC=pcobj.pcid;
    }


    function deletepc(pcobj){
    	//console.log("deleting", pcobj);
    	$http.delete("/api/pcs/"+pcobj._id).success(function(data){
    		//console.log("delete result", data);
    		$scope.pclist=$scope.pclist.filter(function(pc){
    			//console.log("scaning",pc,data);
    			return pc._id !== pcobj._id;
    		});

        // build pcDisponibles list
        $scope.pcDisponibles = getPCDisponibles($scope.pclist);

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