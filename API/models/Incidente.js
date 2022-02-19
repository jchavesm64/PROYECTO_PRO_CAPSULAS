const mongoose = require('mongoose');

const IncidenteSchema = new mongoose.Schema({
    
    maquina: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'maquinas'
    },
    descripcion: {
        type: String,
        require: true,
        trim: true
    },
    fecha: {
        type: Date,
        require: true,
        trim: true
    },
    ubicacion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ubicaciones'
    },
    causa: {
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

module.exports = mongoose.model('incidentes', IncidenteSchema);