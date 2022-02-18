const mongoose = require('mongoose');

const MaquinaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        require: true,
        trim: true
    },
    caracteristicas: {
        type: Array,
        require: true,
        trim: true
    },
    partes: {
        type: Array,
        require: true,
        trim: true
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categorias'
    },
    ubicacion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ubicaciones'
    },
    vida_util:{
        type: Number,
        require: true,
        trim: true
    },
    fecha_adquirido:{
        type: Date,
        require: true,
        trim: true
    },
    estado: {
        type: String,
        require: true,
        trim: true
    }
});

module.exports = mongoose.model('maquinas', MaquinaSchema);