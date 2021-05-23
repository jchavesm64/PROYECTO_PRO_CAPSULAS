import gql from 'graphql-tag';

export const OBTENER_TIPO_PROVEDURIA = gql`
    query obtenerTipoProveduria{
        obtenerTipoProveduria{
            id
            tipo
            estado
        }
    }
`;

export const SAVE_TIPO_PROVEDURIA = gql`
    mutation insertarTipoProveduria($input:TipoProveduriaInput){
        insertarTipoProveduria(input:$input){
            id
        }
    }
`;

export const UPDATE_TIPO_PROVEDURIA = gql`
    mutation actualizarTipoProveduria($id:ID, $input:TipoProveduriaInput){
        actualizarTipoProveduria(id:$id, input:$input){
            id
        }
    }
`;

export const DELETE_TIPO_PROVEDURIA = gql`
    mutation desactivarTipoProveduria($id:ID){
        desactivarTipoProveduria(id:$id)
    }
`;