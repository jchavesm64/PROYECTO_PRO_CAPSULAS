const mongoose = require('mongoose');

const CotizacionSchema = mongoose.Schema({
    cantidad:{
        type: Number,
        require: true,
        trim: true
    },
    envases:{
        type: Number,
        require: true,
        trim: true
    },
    venta:{
        type: Number,
        require: true,
        trim: true
    },
    elementos:[{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'MateriasPrimas'
    }],
    porcentajes:{
        type: Array,
        require: true
    },
    lotes:[{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Movimientos'
    }],
    miligramos:{
        type: Array,
        require: true
    },
    precio_kilo:{
        type: Array,
        require: true
    }
})

module.exports = mongoose.model('Cotizaciones', CotizacionSchema);