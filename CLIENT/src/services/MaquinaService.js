import gql from 'graphql-tag';

export const OBTENER_MAQUINAS = gql`
    query obtenerMaquinas{
        obtenerMaquinas{
            id
            nombre
            caracteristicas{
                clave
                valor
            },
            partes{
                parte
                caracteristicas{
                    clave
                    valor
                }
            }
            categoria{
                nombre
            }
            ubicacion
            vida_util
            fecha_adquirido
            estado
        }
    }
`;

export const OBTENER_MAQUINAS_2 = gql`
    query obtenerMaquinas{
        obtenerMaquinas{
            id
            nombre
        }
    }
`;

export const OBTENER_MAQUINA = gql`
    query obtenerMaquina($id:ID){
        obtenerMaquina(id:$id){
            id
            nombre
            caracteristicas{
                clave
                valor
            },
            partes{
                parte
                caracteristicas{
                    clave
                    valor
                }
            }
            categoria{
                id
                nombre
            }
            ubicacion
            vida_util
            fecha_adquirido
            estado
        }
    }
`;

export const SAVE_MAQUINA = gql`
    mutation insertarMaquina($input:MaquinaInput){
        insertarMaquina(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_MAQUINA = gql`
    mutation actualizarMaquina($id:ID, $input:MaquinaInput){
        actualizarMaquina(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_MAQUINA = gql`
    mutation desactivarMaquina($id:ID){
        desactivarMaquina(id:$id){
            estado
            message
        }
    }
`;