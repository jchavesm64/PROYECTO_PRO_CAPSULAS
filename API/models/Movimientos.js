const mongose = require('mongoose');

const MovimientosSchema = new mongose.Schema({
    tipo:{
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
    unidad:{
        type: String,
        require: true,
        trim: true
    },
    precio:{
        type: Number,
        require: true,
        trim: true
    },
    precio_unidad:{
        type: Number,
        require: true,
        trim: true
    },
    usuario:{
        type: mongose.Schema.Types.ObjectId,
        ref: 'usuarios'
    },
    materia_prima:{
        type: mongose.Schema.Types.ObjectId,
        ref: 'MateriasPrimas'
    }
});

module.exports = mongose.model('Movimientos', MovimientosSchema);