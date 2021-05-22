const { gql } = require('apollo-server-express');

const tipoProducto_type = gql`
    type TipoProducto{
        id: ID
        tipo: String,
        estado: Estado
    }

    type Query{
        obtenerTipoProductos: [TipoProducto]
    }

    input TipoProductoInput{
        tipo: String,
        estado: Estado
    }

    type Mutation{
        insertarTipoProductos(input:TipoProductoInput):TipoProducto
        actualizarTipoProductos(id:ID, input:TipoProductoInput):TipoProducto
        desactivarTipoProducto(id:ID): String
    }
`;

module.exports = tipoProducto_type;