const { gql } = require('apollo-server-express');

const cliente_type = gql`
    enum TipoCliente{
        FISICO
        EMPRESA
    }

    type Cliente{
        id: ID
        tipo: TipoCliente
        codigo: String
        pais: String
        ciudad: String
        direccion: String
        telefonos: [Telefono]
        correos: [Email]
        estado: Estado
    }

    type Query{
        obtenerClientes: [Cliente]
    }

    input ClienteInput{
        tipo: TipoCliente
        codigo: String
        pais: String
        ciudad: String
        direccion: String
        telefonos: [TelefonoInput]
        correos: [EmailInput]
        estado: Estado
    }

    type Mutation{
        insertarCliente(input:ClienteInput):Cliente
        actualizarCliente(id:ID, input:ClienteInput):Cliente
        desactivarCliente(id:ID):String
    }
`;

module.exports = cliente_type;