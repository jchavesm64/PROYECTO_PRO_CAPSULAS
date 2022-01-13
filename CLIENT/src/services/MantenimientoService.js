import gql from 'graphql-tag';

export const OBTENER_MANTENIMIENTOS = gql`
    query obtenerMantenimientos($id:ID){
        obtenerMantenimientos(id:$id){
            id
            maquina {
                id
                nombre
            }
            fecha_mantenimiento
            fecha_aviso
            descripcion
            estado
        }
    }
`;

export const OBTENER_MANTENIMIENTO = gql`
    query obtenerMantenimiento($id:ID){
        obtenerMantenimiento(id:$id){
            id
            maquina {
                id
                nombre
            }
            descripcion
            fecha
            ubicacion
            causa
            estado
        }
    }
`;

export const SAVE_MANTENIMIENTO = gql`
    mutation insertarMantenimiento($input:MantenimientoInput){
        insertarMantenimiento(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_MANTENIMIENTO = gql`
    mutation actualizarMantenimiento($id:ID, $input:MantenimientoInput){
        actualizarMantenimiento(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_MANTENIMIENTO = gql`
    mutation desactivarMantenimiento($id:ID){
        desactivarMantenimiento(id:$id){
            estado
            message
        }
    }
`;