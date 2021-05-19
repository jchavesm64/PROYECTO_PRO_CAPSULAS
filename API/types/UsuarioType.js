const { gql } = require('apollo-server-express');

const usuario_type = gql`
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
        obtenerUsuariosActivos: [Usuario]
    }
`;

module.exports = usuario_type;