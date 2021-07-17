const { gql } = require('apollo-server-express');

const formula_type = gql`
    scalar Number

    type formula{
        id: ID
        nombre: String
        elementos: [MateriaPrima]
        porcentajes: [Number]
        estado: Estado
    }

    type formulaCompleta{
        id: ID
        nombre: String
        elementos: [MateriaPrimaMovimientos]
        porcentajes: [Number]
    }

    type Query{
        obtenerFormulas: [formula]
        obtenerFormula(id: ID): formula
        obtenerFormulasConMovimiento: [formulaCompleta]
    }

    input formulaInput{
        nombre: String
        elementos: [ID]
        porcentajes: [Number],
        estado: Estado
    }

    type RespuestaFormula{
        estado: Boolean,
        data: formula,
        message: String
    }

    type Mutation{
        insertarFormula(input:formulaInput):RespuestaFormula
        actualizarFormula(id:ID, input:formulaInput):RespuestaFormula
        desactivarFormula(id:ID):RespuestaFormula
    }
`;

module.exports = formula_type;