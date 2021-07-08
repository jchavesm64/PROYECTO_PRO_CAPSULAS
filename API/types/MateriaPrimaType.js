const { gql } = require('apollo-server-express');

const materia_prima_type = gql`
    scalar Date
    scalar Number

    type MateriaPrima{
        id: ID
        nombre: String
        proveedor: Proveedor
        pais: String
        existencias: Number
        estado: Estado
    }

    type Query{
        obtenerMateriasPrimas: [MateriaPrima]
        obtenerMateriaPrima(id:ID): MateriaPrima
    }

    input MateriaPrimaInput{
        nombre: String
        proveedor: ID
        pais: String
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