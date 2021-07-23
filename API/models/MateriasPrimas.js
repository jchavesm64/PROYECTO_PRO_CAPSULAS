const mongose = require('mongoose');

const MateriasPrimasSchema = new mongose.Schema({
    nombre:{
        type: String,
        require: true,
        trim: true,
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
    unidad:{
        type: String,
        require: true,
        trim: true
    },
    existencias:{
        type: Number,
        require: true
    },
    marca:{ //0 Nada, 1 Gelatina, 2 Glicerina
        type: String,
        require: true,
        trim: true
    },
    estado:{
        type: String,
        require: true,
        trim: true,
    }
});

module.exports = mongose.model('MateriasPrimas', MateriasPrimasSchema);