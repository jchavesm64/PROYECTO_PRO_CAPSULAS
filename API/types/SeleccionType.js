const { gql } = require('apollo-server-express');

const seleccion_type = gql`

    type Seleccion{
        id: ID
        producto: Producto
        estado: Estado
    }

    type Query{
        obtenerSelecciones: [Seleccion]
        obtenerSeleccion(id:ID): Seleccion
        obtenerSeleccionConMovimientos: [SeleccionMovimientos]
    }

    input SeleccionInput{
        producto: ID
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