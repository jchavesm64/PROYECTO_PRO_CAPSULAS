const mongoose = require('mongoose');

const PuestoLimpiezaSchema = new mongoose.Schema({
    
    codigo: {
        type: String,
        require: true,
        trim: true
    },
    nombre: {
        type: String,
        require: true,
        trim: true
    },
    ubicacion: {
        type: String,
        require: true,
        trim: true
    },
    areas:{
        type: Array,
        require: true
    },
    estado: {
        type: String,
        require: true,
        trim: true
    }
});

module.exports = mongoose.model('puestos_limpieza', PuestoLimpiezaSchema);