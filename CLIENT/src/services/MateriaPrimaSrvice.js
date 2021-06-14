import gql from 'graphql-tag';

export const OBTENER_MATERIAS_PRIMAS = gql`
    query obtenerMateriasPrimas{
        obtenerMateriasPrimas{
            id
            nombre
            lote
            fechaFabricacion
            fechaVencimiento
            proveedor{
                id
                empresa
                cedula
            }
            pais
            codigo
            existencias
            estado
            estado
        }
    }
`;

export const OBTENER_MATERIA_PRIMA = gql`
    query obtenerMateriaPrima($id:ID){
        obtenerMateriaPrima(id:$id){
            id
            nombre
            lote
            fechaFabricacion
            fechaVencimiento
            proveedor{
                id
                empresa
                cedula
            }
            pais
            codigo
            existencias
            estado
            estado
        }
    }
`;

export const SAVE_MATERIA_PRIMA = gql`
    mutation insertarMateriaPrima($input:MateriaPrimaInput){
        insertarMateriaPrima(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_MATERIA_PRIMA = gql`
    mutation actualizarMateriaPrima($id:ID, $input:MateriaPrimaInput){
        actualizarMateriaPrima(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_MATERIA_PRIMA = gql`
    mutation desactivarMateriaPrima($id:ID){
        desactivarMateriaPrima(id:$id){
            estado
            message
        }
    }
`;