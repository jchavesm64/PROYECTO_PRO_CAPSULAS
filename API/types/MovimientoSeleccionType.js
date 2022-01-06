const { gql } = require('apollo-server-express');

const movimientos_type = gql`
    scalar Date
    scalar Number

    enum Tipo{
        ENTRADA
        SALIDA
    }    

    type MovimientosSeleccionType{
        id: ID
        lote: String
        tipo: Tipo
        fecha: Date
        cantidad: Number
        usuario: Usuario
        seleccion: Producto
    }

    type RespuestaMovimientosSeleccion{
        estado: Boolean
        data: MovimientosSeleccionType
        message: String
    }

    input MovimientosSeleccionInput{
        tipo: Tipo
        lote: String
        fecha: Date
        cantidad: Number
        usuario: ID
        seleccion: ID
    }

    type Query{
        obtenerMovimientosSeleccion(id:ID): [MovimientosSeleccionType]
    }

    type Mutation{
        insertarMovimientoSeleccion(input:MovimientosSeleccionInput):RespuestaMovimientosSeleccion
    }
`;

module.exports = movimientos_type;