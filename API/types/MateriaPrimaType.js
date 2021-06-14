const { gql } = require('apollo-server-express');

const materia_prima_type = gql`
    scalar Date
    scalar Number

    type MateriaPrima{
        id: ID
        nombre: String
        lote: String
        fechaFabricacion: Date
        fechaVencimiento: Date
        proveedor: Proveedor
        pais: String
        codigo: String
        existencias: Number
        estado: Estado
    }

    type Query{
        obtenerMateriasPrimas: [MateriaPrima]
        obtenerMateriaPrima(id:ID): MateriaPrima
    }

    input MateriaPrimaInput{
        nombre: String
        lote: String
        fechaFabricacion: Date
        fechaVencimiento: Date
        proveedor: ID
        pais: String
        codigo: String
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