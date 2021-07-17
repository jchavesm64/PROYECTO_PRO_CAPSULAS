import gql from 'graphql-tag';

export const SAVE_COTIZACION = gql`
    mutation insertarCotizacion($input:entradasCotizacion){
        insertarCotizacion(input:$input){
            estado
            message
        }
    }
`;