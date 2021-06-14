const mongose = require('mongoose');

const MateriasPrimasSchema = new mongose.Schema({
    nombre:{
        type: String,
        require: true,
        trim: true,
    },
    lote:{
        type: String,
        require: true,
        trim: true
    },
    fechaFabricacion:{
        type: Date,
        required: true,
    },
    fechaVencimiento:{
        type: Date,
        required: true,
    },
    proveedor:{
        type: mongose.Schema.Types.ObjectId,
        ref: 'proveedores'
    },
    pais:{
        type: String,
        require: true,
        trim: true
    },
    codigo:{
        type: String,
        require: true,
        trim: true
    },
    existencias:{
        type: Number,
        require: true
    },
    estado:{
        type: String,
        require: true,
        trim: true,
    }
});

module.exports = mongose.model('MateriasPrimas', MateriasPrimasSchema);