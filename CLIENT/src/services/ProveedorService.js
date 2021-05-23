import gql from 'graphql-tag';

export const OBTENER_PROVEEDORES = gql`
    query obtenerProveedores{
        obtenerProveedores{
            id
            empresa
            cedula
            pais
            ciudad
            direccion
            telefonos{
                telefono
            }
            correos{
                email
            }
            provedurias{
                tipo
                estado
            }
        }
    }
`;

export const SAVE_PROVEEDOR = gql`
    mutation insertarProveedor($input:ProveedorInput){
        insertarProveedor(input:$input){
            id
        }
    }
`;

export const UPDATE_PROVEEDOR = gql`
    mutation actualizarProveedor($id:ID, $input:ProveedorInput){
        actualizarProveedor(id:$id, input:$input){
            id
        }
    }
`;

export const DELETE_PROVEEDOR = gql`
    mutation desactivarProveedor($id:ID){
        desactivarProveedor(id:$id)
    }
`;