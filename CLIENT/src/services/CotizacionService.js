import gql from 'graphql-tag';

export const SAVE_COTIZACION = gql`
    mutation insertarCotizacion($input:cotizacion){
        insertarCotizacion(input:$input){
            estado
            message
        }
    }
`;

export const OBTENER_COTIZACIONES = gql`
    query obtenerCotizaciones{
        obtenerCotizaciones{
            id
            formula{
            nombre
            }
            cantidad
            costoCapsula
            envases
            costoEnvase
            etiqueta
          	costoEtiqueta
            venta
            elementos{
            id
            nombre
            }
            porcentajes
            miligramos
            precio_kilo
        }
    }
`;

export const OBTENER_COTIZACION = gql`
    query obtenerCotizacion($id:ID){
        obtenerCotizacion(id:$id){
            id
            formula{
            nombre
            }
            cantidad
            envases
            venta
            elementos{
            id
            nombre
            }
            porcentajes
            miligramos
            precio_kilo
        }
    }
`;