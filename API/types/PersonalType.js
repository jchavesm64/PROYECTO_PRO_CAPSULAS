const { gql } = require('apollo-server-express');

const personal_type = gql`

    scalar Date

    type Personal{
        id: ID
        nombre: String
        cedula: String
        pais: String
        state: String
        ciudad: String
        calle: String
        codpostal: String
        direccion: String
        telefonos: [Telefono]
        correos: [Email]
        puesto: Puesto
        fecha_contrato: Date
        estado: Estado
    }

    type Query{
        obtenerPersonal: [Personal]
        obtenerPersonalOne(id:ID): Personal
        obtenerEmpleados(lista: [String]): [Personal]
    }

    input PersonalInput{
        nombre: String
        cedula: String
        pais: String
        state: String
        ciudad: String
        calle: String
        codpostal: String
        direccion: String
        telefonos: [TelefonoInput]
        correos: [EmailInput]
        puesto: ID
        fecha_contrato: Date
        estado: Estado
    }

    type RespuestaPersonal{
        estado: Boolean
        data: Personal
        message: String
    }

    type Mutation{
        insertarPersonal(input:PersonalInput):RespuestaPersonal
        actualizarPersonal(id:ID, input:PersonalInput):RespuestaPersonal
        desactivarPersonal(id:ID):RespuestaPersonal
    }
`;

module.exports = personal_type;