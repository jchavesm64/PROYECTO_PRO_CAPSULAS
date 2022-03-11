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
        type: String,
        require: true,
        trim: true,
    }
})

module.exports = mongoose.model('chequeo', ChequeoSchema)