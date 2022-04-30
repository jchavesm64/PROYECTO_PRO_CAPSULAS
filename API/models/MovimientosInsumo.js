const mongose = require('mongoose');

const MovimientoInsumo = new mongose.Schema({
    tipo:{
        type: String,
        require: true,
        trim: true,
        enum: ['ENTRADA', 'SALIDA']
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
    insumo:{
        type: mongose.Schema.Types.ObjectId,
        ref: 'Insumos'
    }
})

module.exports = mongose.model('MovimientosInsumos', MovimientoInsumo);