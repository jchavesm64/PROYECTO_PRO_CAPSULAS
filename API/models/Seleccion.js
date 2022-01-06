const mongoose = require('mongoose');

const SeleccionSchema = mongoose.Schema({

    nombre:{
        type: String,
        require: true,
        trim: true,
    },
    estado:{
        type: String,
        require: true,
        trim: true,
    }

});

module.exports = mongoose.model('Seleccion', SeleccionSchema);