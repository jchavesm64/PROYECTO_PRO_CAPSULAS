const { gql } = require('apollo-server-express');

const shared = gql`
    enum Estado{
        ACTIVO
        INACTIVO
    }

    type Email{
        email: String
    }

    type Telefono{
        telefono: String
    }

    input EmailInput{
        email: String
    }

    input TelefonoInput{
        telefono: String
    }
`;

module.exports = shared;