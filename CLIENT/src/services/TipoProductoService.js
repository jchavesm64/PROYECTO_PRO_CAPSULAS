import gql from 'graphql-tag';

export const OBTENER_TIPO_PRODUCTOS = gql`
    query obtenerTipoProductos{
        obtenerTipoProductos{
            id
            tipo
            estado
        }
    }
`;

export const SAVE_TIPO_PRODUCTOS = gql`
    mutation insertarTipoProductos($input:TipoProductoInput){
        insertarTipoProductos(input:$input){
            id
        }
    }
`;

export const UPDATE_TIPO_PRODUCTOS = gql`
    mutation actualizarTipoProductos($id:ID, $input:TipoProductoInput){
        actualizarTipoProductos(id:$id, input:$input){
            id
        }
    }
`;

export const DELETE_TIPO_PRODUCTOS = gql`
    mutation desactivarTipoProductos($id:ID){
        desactivarTipoProductos(id:$id)
    }
`;