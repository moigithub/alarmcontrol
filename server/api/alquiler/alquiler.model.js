'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AlquilerSchema = new Schema({
  pc: {type:Number, ref:"Pc"},   // num de PC en alquiler
  tiempo: Number,       // cuanto tiempo en minutos 
  libre: Boolean,        // pago despues o adelantado 
  tiempoinicio:{type:Date, default: Date.now},    // fecha hora de inicio
  precio:Number,       // cuando se cierra/termina.. cuanto pago?
  nombre:String,         // nombre alternativo al numero del pc
  notas: String,         // algun comentario sobre el pc.. debe, 1 gaseosa x cobrar
  tipo: String,       // continua, nuevo
  activo: Boolean     // esta en alquiler?
});

module.exports = mongoose.model('Alquiler', AlquilerSchema);