const mongoose = require('mongoose');

const ChequeoSchema = new mongoose.Schema({
    puesto_limpieza:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'puestos_limpieza'
    },
    areas: {
        type: Array,
        require: true
    },
    fecha:{
        type: Date,
        require: true
    },
    aprobado:{
        type: Boolean,
        require: true,
        trim: true,
    },
    usuario:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuarios'
    },
})

module.exports = mongoose.model('chequeo', ChequeoSchema)