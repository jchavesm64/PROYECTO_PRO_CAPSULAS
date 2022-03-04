const { gql } = require('apollo-server-express');

const planilla_type = gql`

    type Horas {
        empleado: Personal
        horas: Number
        tipo: String
    }

    type Planilla{
        id: ID
        fecha_lunes: Date
        fecha_domingo: Date
        listado_horas: [Horas]
    }

    type Query{
        obtenerPlanilla(f1:Date, f2:Date): Planilla
    }

    input HorasInput {
        empleado: String
        horas: Number
        tipo: String
    }

    input PlanillaInput {
        fecha_lunes: Date
        fecha_domingo: Date
        listado_horas: [HorasInput]
    }

    type RespuestaPlanilla{
        estado: Boolean
        message: String
    }

    type Mutation{
        savePlanilla(input:PlanillaInput):RespuestaPlanilla
    }
`;

module.exports = planilla_type