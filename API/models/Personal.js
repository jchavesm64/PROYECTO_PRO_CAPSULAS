const mongoose = require('mongoose');

const PersonalSchema = new mongoose.Schema({
    nombre:{
        type: String,
        require: true,
        trim: true,
    },
    cedula:{
        type: String,
        require: true,
        trim: true
    },
    pais:{
        type: String,
        require: true,
        trim: true,
    },
    state:{
        type: String,
        require: true,
        trim: true,
    },
    ciudad:{
        type:String,
        require: true,
        trim: true
    },
    calle:{
        type:String,
        require: true,
        trim: true
    },
    codpostal:{
        type:String,
        require: true,
        trim: true
    },
    direccion:{
        type: String,
        require: true,
        trim: true,
    },
    telefonos:{
        type: Array,
        require: true,
        trim: true
    },
    correos:{
        type: Array,
        require: true,
        trim: true
    },
    puesto:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'puestos'
    },
    fecha_contrato:{
        type: Date,
        require: true,
    },
    estado:{
        type:String,
        require: true,
        trim: true
    }
});

module.exports = mongoose.model('personal', PersonalSchema);