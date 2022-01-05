const mongose = require('mongoose');

const MovimientosProductosSchema = new mongose.Schema({
    tipo:{
        type: String,
        require: true,
        trim: true
    },
    fecha_vencimiento:{
        type: Date,
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
    producto:{
        type: mongose.Schema.Types.ObjectId,
        ref: 'Productos'
    },
    fecha:{
        type: Date,
        require: true
    },
});

module.exports = mongose.model('MovimientosProductos', MovimientosProductosSchema);