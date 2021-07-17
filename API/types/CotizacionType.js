const { gql } = require('apollo-server-express');

const cotizacion_type = gql`

    scalar Number,

    input cotizacion{
        cantidad: Number
        envases: Number
        venta: Number
        elementos: [ID]
        porcentajes: [Number]
        lotes: [ID]
        miligramos: [Number]
        precio_kilo: [Number]
    }    

    input lote{
        id: ID
        existencia: Number
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

    input entradasCotizacion{
        objeto: cotizacion
        lotes: [lote]
        salidas: [salida]
    }

    type Respuesta{
        estado: Boolean,
        message: String
    }

    type Mutation{
        insertarCotizacion(input:entradasCotizacion):Respuesta
    }
`;

module.exports = cotizacion_type;