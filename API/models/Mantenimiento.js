const mongoose = require('mongoose');

const MantenimientoSchema = new mongoose.Schema({
    
    maquina: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'maquinas'
    },
    fecha_mantenimiento: {
        type: Date,
        require: true,
        trim: true
    },
    descripcion: {
        type: String,
        require: true,
        trim: true
    },
    observaciones: {
        type: String,
        require: true,
        trim: true
    },
    estado: {
        type: String,
        enum: ['Registrado', 'En Proceso', 'Finalizado'],
        require: true,
        trim: true
    }
});

module.exports = mongoose.model('mantenimientos', MantenimientoSchema);