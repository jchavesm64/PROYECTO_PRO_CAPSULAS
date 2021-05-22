const { gql } = require('apollo-server-express');

const tipoProveduria_type = gql`
    type TipoProveduria{
        id: ID
        tipo: String,
        estado: Estado
    }

    type Query{
        obtenerTipoProveduria: [TipoProveduria]
    }

    input TipoProveduriaInput{
        tipo: String,
        estado: Estado
    }

    type Mutation{
        insertarTipoProveduria(input:TipoProveduriaInput):TipoProveduria
        actualizarTipoProveduria(id:ID, input:TipoProveduriaInput):TipoProveduria
        desactivarTipoProveduria(id:ID):String
    }
`;

module.exports = tipoProveduria_type;