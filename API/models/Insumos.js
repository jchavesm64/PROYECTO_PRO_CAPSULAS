const mongose = require('mongoose');

const InsumoSchema = new mongose.Schema({
    codigo: {
        type: String,
        require: true,
        trim: true
    },
    descripcion: {
        type: String,
        require: true,
        trim: true
    },
    area: {
        type: mongose.Schema.Types.ObjectId,
        ref: 'ubicaciones'
    },
    estado: {
        type: String,
        require: true,
        trim: true
    }
})

module.exports = mongose.model('Insumos', InsumoSchema);