import gql from 'graphql-tag'

export const OBTENER_MOVIMIENTOS = gql`
    query obtenerMovimientos($id:ID){
        obtenerMovimientos(id:$id){
            id
            fecha
            tipo
            usuario{
                id
                nombre
                cedula
            }
            cantidad
            unidad
            precio
            precio_unidad
            materia_prima{
                id
                nombre
            }
        }
    }
`;

export const SAVE_MOVIMIENTO = gql`
    mutation insertarMovimiento($input:MovimientosInput){
    insertarMovimiento(input:$input){
        estado
        message
    }
    }
`;