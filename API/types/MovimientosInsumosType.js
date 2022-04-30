const { gql } = require('apollo-server-express');

const movimientosinsumos_type = gql`
    scalar Date
    scalar Number

    type MovimientosInsumoType{
        id: ID
        tipo: String
        fecha: Date
        cantidad: Number
        usuario: Usuario
        insumo: Insumo
    }

    type RespuestaMovimientosInsumo{
        estado: Boolean
        data: MovimientosInsumoType
        message: String
    }

    input MovimientosInsumoInput{
        tipo: String
        fecha: Date
        cantidad: Number
        usuario: ID
        insumo: ID
    }

    type Query{
        obtenerMovimientosInsumo(id:ID): [MovimientosInsumoType]
    }

    type Mutation{
        insertarMovimientoInsumo(input:MovimientosInsumoInput):RespuestaMovimientosInsumo
    }
`;

module.exports = movimientosinsumos_type;