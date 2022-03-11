const { gql } = require('apollo-server-express')

const chequeo_type = gql`

    scalar Date
    scalar Number

    enum Aprobado {
        APROBADO
        SIN_REVISAR
    }

    enum EstadoArea {
        VISTO
        SIN_VER
    }

    type AreasChequeo {
        area: String
        estado: EstadoArea
    }

    type Chequeo {
        id: ID
        puesto_limpieza: PuestoLimpieza
        areas: [AreasChequeo]
        fecha: Date
        aprobado: Aprobado
    }

    type RespuestaBuscar {
        chequeo: Chequeo
        estado: Number
    }

    type Query {
        obtenerChequeos(id:ID, fecha1: Date, fecha2: Date): [Chequeo]
        obtenerChequeo(id:ID, fecha: Date): RespuestaBuscar
    }

    input AreasChequeoInput {
        area: String
        estado: EstadoArea
    }

    input ChequeoInput {
        id: ID
        puesto_limpieza: ID
        areas: [AreasChequeoInput]
        fecha: Date
        aprobado: Aprobado
    }

    type RespuestaChequeo {
        estado: Boolean
        message: String
    }

    type Mutation {
        insertarChequeo(input:ChequeoInput): RespuestaChequeo
        actualizarChequeo(id:ID, input: ChequeoInput): RespuestaChequeo
        aprobarChequeo(id:ID): RespuestaChequeo
    }

`;

module.exports = chequeo_type
