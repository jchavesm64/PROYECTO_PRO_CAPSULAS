import gql from 'graphql-tag'

export const OBTENER_MOVIMIENTOS = gql`
    query obtenerMovimientos($id:ID){
        obtenerMovimientos(id:$id){
            id
            tipo
            lote
            codigo
            fechaFabricacion
            fechaVencimiento
            fecha
            cantidad
            existencia
            precio
            precio_unidad
            usuario{
                id
                nombre
                cedula
            }
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