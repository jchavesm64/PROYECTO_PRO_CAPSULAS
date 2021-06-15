const { gql } = require('apollo-server-express');

const movimientos_type = gql`
    scalar Date
    scalar Number

    enum Tipo{
        ENTRADA
        SALIDA
    }    

    enum Unidad {
        Kilogramo
        Litro
    }

    type MovimientosType{
        id: ID
        fecha: Date
        tipo: Tipo
        usuario: Usuario
        materia_prima: MateriaPrima
        cantidad: Number
        unidad: Unidad
        precio: Number
        precio_unidad: Number
    }

    type RespuestaMovimientos{
        estado: Boolean
        data: MovimientosType
        message: String
    }

    input MovimientosInput{
        fecha: Date
        tipo: Tipo
        usuario: ID
        materia_prima: ID
        cantidad: Number
        unidad: Unidad
        precio: Number
        precio_unidad: Number
    }

    type Query{
        obtenerMovimientos(id:ID): [MovimientosType]
    }

    type Mutation{
        insertarMovimiento(input:MovimientosInput):RespuestaMovimientos
    }
`;

module.exports = movimientos_type;