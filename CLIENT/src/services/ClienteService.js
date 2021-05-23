import gql from 'graphql-tag';

export const OBTENER_CLIENTES = gql`
    query obtenerClientes{
        obtenerClientes{
            id
            tipo
            codigo
            pais
            ciudad
            direccion
            telefonos{
                telefono
            }
            correos{
                email
            }
            estado
        }
    }
`;

export const SAVE_CLIENTE = gql`
    mutation insertarCliente($input:ClienteInput){
        insertarCliente(input:$input){
            id
        }
    }
`;

export const UPDATE_CLIENTE = gql`
    mutation actualizarCliente($id:ID, $input:ClienteInput){
        actualizarCliente(id:$id, input:$input){
            id
        }
    }
`;

export const DELETE_CLIENTE = gql`
    mutation desactivarCliente($id:ID){
        desactivarCliente(id:$id)
    }
`;