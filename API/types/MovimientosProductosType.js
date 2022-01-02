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

    input item{
        id: ID
        nombre: String
        cantidad: Number
    }

    input salida{
        id: ID,
        cantidad: Number
    }

    input salidas{
        usuario: ID
        cotizacion: ID
        elementos: [salida]
    }

    input salida_inventario{
        tipo: Tipo
        fecha: Date
        cantidad: Number
        usuario: ID
        producto: ID
    }

    input MovimientosProductosInput{
        tipo: Tipo
        fecha_vencimiento: Date
        fecha: Date
        cantidad: Number
        usuario: ID
        producto: ID
    }

    input Items{
        items: [item]
    }

    type Query{
        obtenerMovimientosProductos(id:ID): [MovimientosProductosType]
    }

    type RespuestaUpload{
        estado: Boolean
        filename: String
        message: String
    }

    type Mutation{
        insertarMovimientoProducto(input:MovimientosProductosInput):RespuestaMovimientosProductos
        insertarSalidaProducto(input:salida_inventario):RespuestaMovimientosProductos
    }
`;

module.exports = movimientos_type;