const { gql } = require('apollo-server-express');

const puesto_type = gql`

    scalar Number

    type Puesto{
        id: ID
        nombre: String
        salario: Number
    }

    type Query{
        obtenerPuestos: [Puesto]
    }

    input PuestoInput{
        nombre: String
        salario: Number
        estado: Estado
    }

    type RespuestaPuesto{
        estado: Boolean
        data: Puesto
        message: String
    }

    type Mutation{
        insertarPuesto(input:PuestoInput):RespuestaPuesto
        actualizarPuesto(id:ID, input:PuestoInput):RespuestaPuesto
        desactivarPuesto(id:ID):RespuestaPuesto
    }

`;

module.exports = puesto_type