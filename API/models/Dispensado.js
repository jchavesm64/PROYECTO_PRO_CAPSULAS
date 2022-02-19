const mongoose = require('mongoose');

const DispensadoSchema = mongoose.Schema({

    producto:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Productos'
    },
    estado:{
        type: String,
        require: true,
        trim: true,
    }

});

module.exports = mongoose.model('Dispensado', DispensadoSchema);