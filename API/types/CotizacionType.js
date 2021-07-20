const { gql } = require('apollo-server-express');

const cotizacion_type = gql`

    scalar Number,

    type Cotizacion{
        id: ID
        formula: formula
        cantidad: Number
        costoCapsula: Number
        envases: Number
        costoEnvase: Number
        etiqueta: Number
        costoEtiqueta: Number
        venta: Number
        elementos: [MateriaPrima]
        porcentajes: [Number]
        miligramos: [Number]
        precio_kilo: [Number]
    }

    input cotizacion{
        formula: ID
        cantidad: Number
        costoCapsula: Number
        envases: Number
        costoEnvase: Number
        etiqueta: Number
        costoEtiqueta: Number
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

    type Query{
        obtenerCotizaciones: [Cotizacion]
        obtenerCotizacion(id:ID): Cotizacion
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