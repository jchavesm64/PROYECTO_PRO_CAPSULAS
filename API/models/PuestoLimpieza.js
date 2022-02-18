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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ubicaciones'
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