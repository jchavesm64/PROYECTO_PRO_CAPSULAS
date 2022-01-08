const { gql } = require('apollo-server-express');

const incidente_type = gql`

    scalar Date

    type PuestoLimpieza{
        id: ID
        descripcion: String
        nombre: String
        ubicacion: [String]
        areas: Date
        estado: Estado
    }

    type Query{
        obtenerPuestoLimpiezas: [PuestoLimpieza]
        obtenerPuestoLimpieza(id:ID): PuestoLimpieza
    }

    input PuestoLimpiezaInput{
        descripcion: String
        nombre: String
        ubicacion: [String]
        areas: Date
        estado: Estado
    }

    type RespuestaPuestoLimpieza{
        estado: Boolean
        data: PuestoLimpieza
        message: String
    }

    type Mutation{
        insertarPuestoLimpieza(input:PuestoLimpiezaInput):RespuestaPuestoLimpieza
        actualizarPuestoLimpieza(id:ID, input:PuestoLimpiezaInput):RespuestaPuestoLimpieza
        desactivarPuestoLimpieza(id:ID):RespuestaPuestoLimpieza
    }
`;

module.exports = incidente_type