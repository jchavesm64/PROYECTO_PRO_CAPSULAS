const { gql } = require('apollo-server-express');

const cotizacion_type = gql`

    scalar Number,

    input cotizacion{
        cantidad: Number
        envases: Number
        venta: Number
        elementos: [ID]
        porcentajes: [Number]
        miligramos: [Number]
        precio_kilo: [Number]
    }    

    input Materia{
        id: ID
        total: Number
    }

    input entradasCotizacion{
        objeto: cotizacion
        materias: [Materia]
        usuario: ID
    }

    type Respuesta{
        estado: Boolean,
        message: String
    }

    type Mutation{
        insertarCotizacion(input:entradasCotizacion):Respuesta
    }

    input salida{
        tipo: Tipo
        lote: String
        codigo: String
        fecha: Date
        cantidad: Number
        unidad: Unidad
        usuario: ID
        materia_prima: ID
    }

`;

module.exports = cotizacion_type;