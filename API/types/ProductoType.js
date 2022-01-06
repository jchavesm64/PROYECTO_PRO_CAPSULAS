const { gql } = require('apollo-server-express');

const producto_type = gql`
    scalar Date
    scalar Number

    enum Unidad {
        Kilogramo
        Litro
        Unidades
    }

    type Producto{
        id: ID
        nombre: String
        unidad: Unidad
        existencias: Number
        orden_produccion: Cotizacion
        estado: Estado
    }

    type Query{
        obtenerProductos: [Producto]
        obtenerProducto(id:ID): Producto
        obtenerProductosConMovimientos: [ProductoMovimientos]
    }

    input ProductoInput{
        nombre: String
        unidad: Unidad
        existencias: Number
        orden_produccion: ID
        estado: Estado
    }

    type RespuestaProducto{
        estado: Boolean
        data: Producto
        message: Date
    }

    type Mutation{
        insertarProducto(input:ProductoInput): RespuestaProducto
        actualizarProducto(id:ID, input:ProductoInput): RespuestaProducto
        desactivarProducto(id:ID): RespuestaProducto
    }
`;

module.exports = producto_type;