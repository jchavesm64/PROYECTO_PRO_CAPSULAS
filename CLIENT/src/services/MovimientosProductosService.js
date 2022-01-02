import gql from 'graphql-tag'

export const OBTENER_MOVIMIENTOS_PRODUCTOS = gql`
    query obtenerMovimientos($id:ID){
        obtenerMovimientos(id:$id){
            id
            tipo
            fecha_vencimiento
            fecha
            cantidad
            usuario{
                id
                nombre
                cedula
            }
            producto{
                id
                nombre
            }
            fecha
        }
    }
`;

export const SAVE_MOVIMIENTO = gql`
    mutation insertarMovimientoProducto($input:MovimientosInput){
        insertarMovimientoProducto(input:$input){
            estado
            message
        }
    }
`;


export const SAVE_SALIDA = gql`
    mutation insertarSalidaProducto($input:salida_inventario){
        insertarSalidaProducto(input:$input){
            estado
            message
        }
    }
`;