const mongoose = require('mongoose');

const ActivoSchema = new mongoose.Schema({
    numero:{
        type: String,
        require: true,
        trim: true
    },
    descripcion:{
        type: String,
        require: true,
        trim: true
    },
    modelo:{
        type: String,
        require: true,
        trim: true
    },
    serie:{
        type: String,
        require: true,
        trim: true
    },
    fecha_etiquetado:{
        type: Date,
        require: true,
        trim: true
    },
    fecha_ingreso:{
        type: Date,
        require: true,
        trim: true
    },
    fecha_desecho:{
        type: Date,
        trim: true
    },
    estado:{
        type: String,
        enum: ['Nuevo', 'Desechado', 'En Buen Estado'],
        require: true,
        trim: true
    },
    state:{
        type: String,
        require: true,
        trim: true
    }
});

module.exports = mongoose.model('activos', ActivoSchema);