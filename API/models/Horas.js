const mongoose = require('mongoose');

const HorasSchema = mongoose.Schema({

    empleado:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'personal'
    },
    horas:{
        type: Number,
        require: true,
        trim: true,
    },
    costo_hora:{
        type: Number,
        require: true,
        trim: true,
    },
    detalle:{
        type: String,
        require: true,
        trim: true,
    },
    tipo:{
        type: String,
        enum: ['P', 'C', 'A'],
        require: true,
        trim: true,
    },
    fecha:{
        type: Date,
        require: true,
        trim: true,
    }

});

module.exports = mongoose.model('Horas', HorasSchema);