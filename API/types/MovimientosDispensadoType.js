const { gql } = require('apollo-server-express');

const movimientos_type = gql`
    scalar Date
    scalar Number

    enum Tipo{
        ENTRADA
        SALIDA
    }    

    type MovimientosDispensadoType{
        id: ID
        lote: String
        tipo: Tipo
        fecha: Date
        cantidad: Number
        usuario: Usuario
        dispensado: Dispensado
    }

    type RespuestaMovimientosDispensado{
        estado: Boolean
        data: MovimientosDispensadoType
        message: String
    }

    input MovimientosDispensadoInput{
        tipo: Tipo
        lote: String
        fecha: Date
        cantidad: Number
        usuario: ID
        dispensado: ID
    }

    type Query{
        obtenerMovimientosDispensado(id:ID): [MovimientosDispensadoType]
    }

    type Mutation{
        insertarMovimientoDispensado(input:MovimientosDispensadoInput):RespuestaMovimientosDispensado
    }
`;

module.exports = movimientos_type;