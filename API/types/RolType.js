const { gql } = require('apollo-server-express');

const rol_type = gql`
    enum tipo_rol{
        ADMINISTRADOR
        GESTOR
    }

    type Rol{
        id: ID
        tipo: tipo_rol
        permisos: [Permiso]
        estado: Estado
    }

    type Query{
        obtenerRoles: [Rol]
    }

    input RolInput{
        tipo: tipo_rol
        permisos: [ID]
        estado: Estado
    }

    type Mutation{
        insertarRol(input:RolInput):Rol
        actualizarRol(id:ID, input:RolInput):Rol
        desactivarRol(id:ID):String
    }
`;

module.exports = rol_type;