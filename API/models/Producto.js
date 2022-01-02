const mongoose = require('mongoose');

const ProductoSchema = mongoose.Schema({

    nombre:{
        type: String,
        require: true,
        trim: true,
    },
    unidad:{
        type: String,
        require: true,
        trim: true
    },
    existencias:{
        type: Number,
        require: true
    },
    orden_produccion:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cotizaciones'
    },
    estado:{
        type: String,
        require: true,
        trim: true,
    }

});

module.exports = mongoose.model('Productos', ProductoSchema);