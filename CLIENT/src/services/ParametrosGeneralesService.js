import gql from 'graphql-tag';

export const VALIDAR_PARAMETRO = gql`
    query validarParametro($input:entrada_parametro){
        validarParametro(input:$input){
            estado
            message
        }
    }
`;