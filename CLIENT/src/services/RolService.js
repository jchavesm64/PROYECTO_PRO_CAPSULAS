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