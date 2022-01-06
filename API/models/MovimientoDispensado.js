const mongose = require('mongoose');

const MovimientosDispensadoSchema = new mongose.Schema({
    tipo:{
        type: String,
        require: true,
        trim: true
    },
    lote:{
        type: String,
        require: true,
        trim: true
    },
    fecha:{
        type: Date,
        require: true,
        trim: true
    },
    cantidad:{
        type: Number,
        require: true,
        trim: true
    },
    usuario:{
        type: mongose.Schema.Types.ObjectId,
        ref: 'usuarios'
    },
    dispensado:{
        type: mongose.Schema.Types.ObjectId,
        ref: 'Dispensado'
    }
});

module.exports = mongose.model('MovimientosDispensado', MovimientosDispensadoSchema);