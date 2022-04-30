const { gql } = require('apollo-server-express');

const insumo_type = gql`

type Insumo{
        id: ID
        codigo: String
        area: Ubicacion
        estado: Estado
    }

    type Query{
        obtenerInsumos: [Insumo]
        obtenerInsumo(id:ID): Insumo
        obtenerInsumosConMovimientos: [InsumoMovimientos]
    }

    input InsumoInput{
        codigo: String
        area: ID
        estado: Estado
    }

    type RespuestaInsumo{
        estado: Boolean
        data: Insumo
        message: Date
    }

    type Mutation{
        insertarInsumo(input:InsumoInput): RespuestaInsumo
        actualizarInsumo(id:ID, input:InsumoInput): RespuestaInsumo
        desactivarInsumo(id:ID): RespuestaInsumo
    }
`;

module.exports = insumo_type;