const { gql } = require('apollo-server-express');

const rol_type = gql`
    enum tipo_rol{
        ADMINISTRADOR
        GESTOR
    }

    type Acciones{
        editar:Boolean
        eliminar:Boolean
        agregar:Boolean
    }

    type Rol{
        id: ID
        tipo: tipo_rol
        permisos: [Permiso]
        acciones: [Acciones]
        estado: Estado
    }

    type Query{
        obtenerRoles: [Rol]
    }

    input AccionesInput{
        editar:Boolean
        eliminar:Boolean
        agregar:Boolean
    }

    input RolInput{
        tipo: tipo_rol
        permisos: [ID]
        acciones: [AccionesInput]
        estado: Estado
    }

    type Mutation{
        insertarRol(input:RolInput):Rol
        actualizarRol(id:ID, input:RolInput):Rol
        desactivarRol(id:ID):String
    }
`;

module.exports = rol_type;