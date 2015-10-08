'use strict';

angular.module('alarmcontrolApp')
  .controller('AlquilaCtrl', function ($scope, $http) {
    $scope.alquiler = {
    	pc: '0',
		tiempo: 15,       // cuanto tiempo en minutos 
		libre: false,        // pago despues o adelantado 
		tiempoinicio:Date.now(),    // fecha hora de inicio
		precio:0,       // cuando se cierra/termina.. cuanto pago?
		nombre:'',         // nombre alternativo al numero del pc
		notas: '',         // algun comentario sobre el pc.. debe, 1 gaseosa x cobrar
		tipo: 'nuevo',       // continua, nuevo
		activo: true
    };


    $scope.alquilerLista = [];
    $http.get("/api/alquiler").success(function(data){
    	console.log("alquilerlista",data);
    	$scope.alquilerLista = data;
    });


    $scope.saveAlquiler = saveAlquiler;
    $scope.deleteAlquiler = deletealquiler;



    function saveAlquiler(alquilerObj){
    	console.log("saving..", alquilerObj);
    	$http.post("/api/alquiler", alquilerObj).success(function(data){
    		console.log("saved",data);
    		$scope.alquilerLista.push(data);

    		$scope.alquiler = {
		    	pc: 0,
				tiempo: 15,       // cuanto tiempo en minutos 
				libre: false,        // pago despues o adelantado 
			//	tiempoinicio:Date.now(),    // fecha hora de inicio
				precio:0,       // cuando se cierra/termina.. cuanto pago?
				nombre:'',         // nombre alternativo al numero del pc
				notas: '',         // algun comentario sobre el pc.. debe, 1 gaseosa x cobrar
				tipo: 'nuevo',       // continua, nuevo
				activo: true
		    };
    	});
    }

    function deletealquiler(alquilerObj){
    	console.log("deleting", alquilerObj);
    	$http.delete("/api/alquiler/"+alquilerObj._id).success(function(data){
    		console.log("delete result", data);
    		$scope.alquilerLista=$scope.alquilerLista.filter(function(pc){
    			return pc._id !== alquilerObj._id;
    		});
    	});
    }

  });
