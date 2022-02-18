const { gql } = require('apollo-server-express');

const categoria_type = gql`
    type Categoria{
        id: ID
        nombre: String,
        estado: Estado
    }

    type Query{
        obtenerCategorias: [Categoria]
    }

    input CategoriaInput{
        nombre: String,
        estado: Estado
    }

    type RespuestaCategoria{
        estado: Boolean
        data: Categoria
        message: String
    }

    type Mutation{
        insertarCategoria(input:CategoriaInput):RespuestaCategoria
        actualizarCategoria(id:ID, input:CategoriaInput):RespuestaCategoria
        desactivarCategoria(id:ID): RespuestaCategoria
    }
`;

module.exports = categoria_type;