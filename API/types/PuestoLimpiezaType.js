const { gql } = require('apollo-server-express');

const incidente_type = gql`

    scalar Date

    type Area{
        nombre: String
    }

    type PuestoLimpieza{
        id: ID
        codigo: String
        nombre: String
        ubicacion: Ubicacion
        areas: [Area]
        estado: Estado
    }

    type Query{
        obtenerPuestoLimpiezas: [PuestoLimpieza]
        obtenerPuestoLimpieza(id:ID): PuestoLimpieza
    }

    input AreaInput{
        nombre: String
    }

    input PuestoLimpiezaInput{
        codigo: String
        nombre: String
        ubicacion: ID
        areas: [AreaInput]
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