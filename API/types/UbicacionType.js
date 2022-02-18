const { gql } = require('apollo-server-express');

const ubicaciones_type = gql`
    type Ubicacion{
        id: ID
        nombre: String,
        estado: Estado
    }

    type Query{
        obtenerUbicaciones: [Ubicacion]
    }

    input UbicacionInput{
        nombre: String,
        estado: Estado
    }

    type RespuestaUbicacion{
        estado: Boolean
        data: Ubicacion
        message: String
    }

    type Mutation{
        insertarUbicacion(input:UbicacionInput):RespuestaUbicacion
        actualizarUbicacion(id:ID, input:UbicacionInput):RespuestaUbicacion
        desactivarUbicacion(id:ID): RespuestaUbicacion
    }
`;

module.exports = ubicaciones_type;