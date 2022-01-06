const { gql } = require('apollo-server-express');

const seleccion_type = gql`

    type Seleccion{
        id: ID
        nombre: String
        estado: Estado
    }

    type Query{
        obtenerSelecciones: [Seleccion]
        obtenerSeleccion(id:ID): Seleccion
        obtenerSeleccionConMovimientos: [SeleccionMovimientos]
    }

    input SeleccionInput{
        nombre: String
        estado: Estado
    }

    type RespuestaSeleccion{
        estado: Boolean
        data: Seleccion
        message: Date
    }

    type Mutation{
        insertarSeleccion(input:SeleccionInput): RespuestaSeleccion
        actualizarSeleccion(id:ID, input:SeleccionInput): RespuestaSeleccion
        desactivarSeleccion(id:ID): RespuestaSeleccion
    }
`;

module.exports = seleccion_type;