const { gql } = require('apollo-server-express');

const incidente_type = gql`

    scalar Date

    type Incidente{
        id: ID
        maquina: Maquina
        descripcion: String
        fecha: Date
        ubicacion: String
        causa: String
        estado: Estado
    }

    type Query{
        obtenerIncidentes(id:ID): [Incidente]
    }

    input IncidenteInput{
        maquina: ID
        descripcion: String
        fecha: Date
        ubicacion: String
        causa: String
        estado: Estado
    }

    type RespuestaIncidente{
        estado: Boolean
        data: Incidente
        message: String
    }

    type Mutation{
        insertarIncidente(input:IncidenteInput):RespuestaIncidente
        actualizarIncidente(id:ID, input:IncidenteInput):RespuestaIncidente
        desactivarIncidente(id:ID):RespuestaIncidente
    }
`;

module.exports = incidente_type