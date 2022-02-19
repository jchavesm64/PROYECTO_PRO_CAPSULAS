const { gql } = require('apollo-server-express');

const dispensado_type = gql`

    type Dispensado{
        id: ID
        producto: Producto
        estado: Estado
    }

    type Query{
        obtenerDispensados: [Dispensado]
        obtenerDispensado(id:ID): Dispensado
        obtenerDispensadoConMovimientos: [DispensadoMovimientos]
    }

    input DispensadoInput{
        producto: ID
        estado: Estado
    }

    type RespuestaDispensado{
        estado: Boolean
        data: Dispensado
        message: Date
    }

    type Mutation{
        insertarDispensado(input:DispensadoInput): RespuestaDispensado
        actualizarDispensado(id:ID, input:DispensadoInput): RespuestaDispensado
        desactivarDispensado(id:ID): RespuestaDispensado
    }
`;

module.exports = dispensado_type;