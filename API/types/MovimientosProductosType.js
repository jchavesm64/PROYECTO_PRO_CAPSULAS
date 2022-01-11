const { gql } = require('apollo-server-express');

const movimientos_type = gql`
    scalar Date
    scalar Number

    enum Tipo{
        ENTRADA
        SALIDA
    }    

    type MovimientosProductosType{
        id: ID
        tipo: Tipo
        fecha_vencimiento: Date
        fecha: Date
        cantidad: Number
        usuario: Usuario
        producto: Producto
    }

    type RespuestaMovimientosProductos{
        estado: Boolean
        data: MovimientosProductosType
        message: String
    }

    type RespuestaVerificar{
        estado: Number
        message: String
    }

    input MovimientosProductosInput{
        tipo: Tipo
        fecha_vencimiento: Date
        fecha: Date
        cantidad: Number
        usuario: ID
        producto: ID
    }

    type Query{
        obtenerMovimientosProductos(id:ID): [MovimientosProductosType]
    }

    type Mutation{
        insertarMovimientoProducto(input:MovimientosProductosInput):RespuestaMovimientosProductos
    }
`;

module.exports = movimientos_type;