const { gql } = require('apollo-server-express');

const mantenimiento_type = gql`

    scalar Date

    type Mantenimiento{
        id: ID
        maquina: Maquina
        fecha_mantenimiento: Date
        descripcion: String
        observaciones: String
        estado: String
    }

    type Query{
        obtenerMantenimientos(id:ID): [Mantenimiento]
        obtenerMantenimiento(id:ID): Mantenimiento
    }

    input MantenimientoInput{
        maquina: ID
        fecha_mantenimiento: Date
        descripcion: String
        observaciones: String
        estado: String
    }

    type RespuestaMantenimiento{
        estado: Boolean
        data: Mantenimiento
        message: String
    }

    type Mutation{
        insertarMantenimiento(input:MantenimientoInput):RespuestaMantenimiento
        actualizarMantenimiento(id:ID, input:MantenimientoInput):RespuestaMantenimiento
        desactivarMantenimiento(id:ID):RespuestaMantenimiento
    }
`;

module.exports = mantenimiento_type