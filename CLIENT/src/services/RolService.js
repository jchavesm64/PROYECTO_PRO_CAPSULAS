import gql from 'graphql-tag';

export const OBTENER_ROLES = gql`
    query obtenerRoles{
        obtenerRoles{
            tipo
            permisos{
            descripcion,
            estado
            }
            estado
        }
    }
`;

export const OBTENER_PERMISOS = gql`
    query obtenerPermisos{
        obtenerPermisos{
            descripcion,
            estado
        }
    }
`;