const mongoose = require('mongoose');

const CategoriaSchema = new mongoose.Schema({
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

module.exports = mongoose.model('categorias', CategoriaSchema);