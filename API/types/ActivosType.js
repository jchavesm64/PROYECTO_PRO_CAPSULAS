const { gql } = require('apollo-server-express');

const activos_type = gql`
    scalar Number
    scalar Date

    type Activo{
        id: ID
        numero: Number
        descripcion: String
        modelo: String
        serie: String
        fecha_etiquetado: Date
        fecha_ingreso: Date
        fecha_desecho: Date
        estado: String
        state: Estado
    }

    type Query{
        obtenerActivos: [Activo]
        obtenerActivo(id:ID): Activo
    }

    input ActivoInput{
        numero: Number
        descripcion: String
        modelo: String
        serie: String
        fecha_etiquetado: Date
        fecha_ingreso: Date
        fecha_desecho: Date
        estado: String
        state: Estado
    }

    type RespuestaActivo{
        estado: Boolean
        data: Activo
        message: String
    }

    type Mutation{
        insertarActivo(input:ActivoInput):RespuestaActivo
        actualizarActivo(id:ID, input:ActivoInput):RespuestaActivo
        desactivarActivo(id:ID):RespuestaActivo
    }
`;

module.exports = activos_type;