const mongose = require('mongoose');

const MovimientosSeleccionSchema = new mongose.Schema({
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
    seleccion:{
        type: mongose.Schema.Types.ObjectId,
        ref: 'Seleccion'
    }
});

module.exports = mongose.model('MovimientosSeleccion', MovimientosSeleccionSchema);