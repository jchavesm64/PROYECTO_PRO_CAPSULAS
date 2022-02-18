const mongoose = require('mongoose');

const UbicacionSchema = new mongoose.Schema({
    nombre:{
        type: String,
        require: true,
        trim: true
    },
    estado:{
        type: String,
        require: true,
        trim: true
    }
});

module.exports = mongoose.model('ubicaciones', UbicacionSchema);