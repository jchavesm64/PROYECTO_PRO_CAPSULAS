const { gql } = require('apollo-server-express');

const usuario_type = gql`
    type confirmacion{
        success: Boolean
        message: String
    }

    type token{
        success: Boolean
        token: String
        mensaje: String
    }
    type Usuario {
        id: ID
        nombre: String
        cedula: String
        clave: String
        correos: [Email]
        telefonos: [Telefono]
        roles: [Rol]
        estado: Estado
    }

    type Query{
        obtenerUsuarioAutenticado: Usuario
        obtenerUsuariosActivos: [Usuario]
    }

    input UsuarioInput{
        nombre: String
        cedula: String
        clave: String
        correos: [EmailInput]
        telefonos: [TelefonoInput]
        roles: [ID]
        estado: Estado
    }

    type Mutation{
        autenticarUsuario(cedula: String!, clave: String!):token
        insertarUsuario(input:UsuarioInput):Usuario
        actualizarUsuario(id:ID, input:UsuarioInput):Usuario
        desactivarUsuario(id:ID):Usuario
        cambiarClave(id:ID, actual:String, nueva:String):confirmacion
        recuperarClave(id:ID, nueva:String):confirmacion
    }
`;

module.exports = usuario_type;