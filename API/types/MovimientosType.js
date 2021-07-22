const { gql } = require('apollo-server-express');

const movimientos_type = gql`
    scalar Date
    scalar Number

    enum Tipo{
        ENTRADA
        SALIDA
    }    

    type MovimientosType{
        id: ID
        tipo: Tipo
        lote: String
        codigo: String
        fechaFabricacion: Date
        fechaVencimiento: Date
        fecha: Date
        cantidad: Number
        existencia: Number
        precio: Number
        precio_unidad: Number
        moneda: Moneda
        cao: String
        usuario: Usuario
        materia_prima: MateriaPrima
    }

    type RespuestaMovimientos{
        estado: Boolean
        data: MovimientosType
        message: String
    }

    input MovimientosInput{
        tipo: Tipo
        lote: String
        codigo: String
        fechaFabricacion: Date
        fechaVencimiento: Date
        fecha: Date
        cantidad: Number
        existencia: Number
        precio: Number
        precio_unidad: Number
        moneda: Moneda
        cao: String
        usuario: ID
        materia_prima: ID
    }

    type Query{
        obtenerMovimientos(id:ID): [MovimientosType]
    }

    type Mutation{
        insertarMovimiento(input:MovimientosInput):RespuestaMovimientos
    }
`;

module.exports = movimientos_type;