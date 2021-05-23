const { gql } = require('apollo-server-express');

const proveedor_type = gql`
    type Proveedor{
        id: ID
        empresa: String
        cedula: String
        pais: String
        cuidad: String
        direccion: String
        telefonos: [Telefono]
        correos: [Email] 
        provedurias: [TipoProveduria]
        estado: Estado
    }

    type Query{
        obtenerProveedores: [Proveedor]
    }

    input ProveedorInput{
        empresa: String
        cedula: String
        pais: String
        cuidad: String
        direccion: String
        telefonos: [TelefonoInput]
        correos: [EmailInput] 
        provedurias: [ID]
        estado: Estado
    }

    type Mutation{
        insertarProveedor(input:ProveedorInput):Proveedor
        actualizarProveedor(id:ID, input:ProveedorInput):Proveedor
        desactivarProveedor(id:ID):String
    }
`;

module.exports = proveedor_type;