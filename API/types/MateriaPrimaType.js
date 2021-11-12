const { gql } = require('apollo-server-express');

const materia_prima_type = gql`
    scalar Date
    scalar Number

    enum Unidad {
        Kilogramo
        Litro
        Unidades
    }

    type MateriaPrima{
        id: ID
        nombre: String
        pais: String
        unidad: Unidad
        existencias: Number
        estado: Estado
    }

    type Query{
        obtenerMateriasPrimas: [MateriaPrima]
        obtenerMateriaPrima(id:ID): MateriaPrima
        obtenerMateriasPrimasConMovimientos: [MateriaPrimaMovimientos]
    }

    input MateriaPrimaInput{
        nombre: String
        pais: String
        unidad: Unidad
        existencias: Number
        estado: Estado
    }

    type RespuestaMateriaPrima{
        estado: Boolean
        data: MateriaPrima
        message: Date
    }

    type Mutation{
        insertarMateriaPrima(input:MateriaPrimaInput): RespuestaMateriaPrima
        actualizarMateriaPrima(id:ID, input:MateriaPrimaInput): RespuestaMateriaPrima
        desactivarMateriaPrima(id:ID): RespuestaMateriaPrima
    }
`;

module.exports = materia_prima_type;