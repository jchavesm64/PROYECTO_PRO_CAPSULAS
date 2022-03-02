import gql from 'graphql-tag';

export const OBTENER_HORAS = gql`
    query obtenerHoras($f1:Date, $f2:Date){
        obtenerHoras(f1:$f1, f2:$f2){
            id
    		empleado{
              nombre
              cedula
              puesto{
                id
                nombre
                salario
              }
            }
    		horas
    		costo_hora
    		tipo
    		fecha 
        }
    }
`;

export const SAVE_HORAS = gql`
    mutation saveHoras($input:HorasInput){
        saveHoras(input:$input){
            estado
            message
        }
    }
`;