const { gql } = require('apollo-server-express');

const hora_type = gql`

    type Horas{
        id: ID
        empleado: Personal
        horas: Number
        costo_hora: Number
        detalle: String
        tipo: String
        fecha: Date
    }

    type Query{
        obtenerHoras(f1:Date, f2:Date): [Horas]
    }

    input HoraInput {
        empleado: String
        horas: Number
        costo_hora: Number
        detalle: String
        tipo: String
        fecha: Date
    }

    input HorasInput {
        horas: [HoraInput]
    }

    type RespuestaHoras{
        estado: Boolean
        message: String
    }

    type Mutation{
        saveHoras(input:HorasInput):RespuestaHoras
    }
`;

module.exports = hora_type