const mongoose = require('mongoose');

const CotizacionSchema = mongoose.Schema({
    formula: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'formulas'
    },
    cantidad: {
        type: Number,
        require: true,
        trim: true
    },
    costoCapsula: {
        type: Number,
        require: true,
        trim: true
    },
    envases: {
        type: Number,
        require: true,
        trim: true
    },
    costoEnvase: {
        type: Number,
        require: true,
        trim: true
    },
    etiqueta: {
        type: Number,
        require: true,
        trim: true
    },
    costoEtiqueta: {
        type: Number,
        require: true,
        trim: true
    },
    venta: {
        type: Number,
        require: true,
        trim: true
    },
    elementos: [{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'MateriasPrimas'
    }],
    porcentajes: {
        type: Array,
        require: true
    },
    miligramos: {
        type: Array,
        require: true
    },
    precio_kilo: {
        type: Array,
        require: true
    }
})

module.exports = mongoose.model('Cotizaciones', CotizacionSchema);