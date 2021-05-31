import gql from 'graphql-tag';

export const OBTENER_USUARIOS_ACTIVOS = gql`
    query obtenerUsuariosActivos{
        obtenerUsuariosActivos{
        id,
        nombre,
        cedula,
        correos{
            email
        },
        telefonos{
            telefono
        },
        roles{
            tipo
            permisos{
                descripcion
            }
            acciones{
                eliminar
                editar
                agregar
            }
        },
        estado
        }
    }
`;

export const OBTENER_USUARIO_AUTENTICADO = gql`
    query obtenerUsuarioAutenticado{
        obtenerUsuarioAutenticado{
            estado,
            data{
                id,
                nombre,
                cedula,
                correos{
                    email
                },
                telefonos{
                    telefono
                },
                roles{
                    tipo
                    permisos{
                        descripcion
                    }
                    acciones{
                        eliminar
                        editar
                        agregar
                    }
                },
                estado 
            }
        }
    }
`;

export const LOGIN = gql`
    mutation autenticarUsuario($cedula:String!, $clave:String!){
        autenticarUsuario(cedula:$cedula, clave:$clave){
            token
        }
    }
`;

export const SAVE_USER = gql`
    mutation insertarUsuario($input:UsuarioInput){
        insertarUsuario(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_USER = gql`
    mutation actualizarUsuario($id:ID, $input:UsuarioInput){
        actualizarUsuario(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_USER = gql`
    mutation desactivarUsuario($id:ID){
        desactivarUsuario(id:$id){
            estado
            message
        }
    }
`;