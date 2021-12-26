const mongoose = require('mongoose');

const PuestoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        require: true,
        trim: true
    },
    salario: {
        type: Number,
        require: true,
        trim: true
    },
    estado: {
        type: String,
        require: true,
        trim: true
    }
});

module.exports = mongoose.model('puestos', PuestoSchema);