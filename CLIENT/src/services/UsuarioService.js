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

