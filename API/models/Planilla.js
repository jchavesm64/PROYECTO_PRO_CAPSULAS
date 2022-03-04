const mongoose = require('mongoose');

const PlanillaSchema = mongoose.Schema({

    fecha_lunes:{
        type: Date,
        require: true,
        trim: true,
    },
    fecha_domingo:{
        type: Date,
        require: true,
        trim: true,
    },
    listado_horas:{
        type: Array,
        require: true,
        trim: true
    }

});

module.exports = mongoose.model('Planilla', PlanillaSchema);