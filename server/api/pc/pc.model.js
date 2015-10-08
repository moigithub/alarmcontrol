'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PcSchema = new Schema({
  pcid: {type: String, required: true, unique: true, index: true},   //pc num , unique
  tiempo: {type: Number, required: true},      // cuanto tiempo en minutos 
  libre: Boolean,        // pago despues o adelantado 
  tiempoinicio:{type:Date, default: new Date, required:true},    // fecha hora de inicio
  precio:Number,       // cuando se cierra/termina.. cuanto pago?
  nombre:String,         // nombre alternativo al numero del pc
  notas: String         // algun comentario sobre el pc.. debe, 1 gaseosa x cobrar
  
  ,historico: Array
});

module.exports = mongoose.model('Pc', PcSchema);


/*
historico:[
  {h.inicio: date, tiempo, h.fin}
]
*/