const { gql } = require('apollo-server-express');

const maquina_type = gql`

    scalar Date
    scalar Number

    type Caracteristicas{
        clave: String
        valor: String
    }

    type Partes{
        parte: String
        caracteristicas: [Caracteristicas]
    }

    type Maquina{
        id: ID
        nombre: String
        caracteristicas: [Caracteristicas]
        partes: [Partes]
        categoria: Categoria
        ubicacion: Ubicacion
        vida_util: Number
        fecha_adquirido: Date
        estado: Estado
    }

    type MaquinaInformation{
        maquina: Maquina
        incidentes: [Incidente]
        mantenimientos: [Mantenimiento]
    }

    type Query{
        obtenerMaquinas: [Maquina]
        obtenerMaquina(id:ID): Maquina
        obtenerInformacionMaquina(id: ID): MaquinaInformation
    }

    input CaracteristicasInput{
        clave: String
        valor: String
    }

    input PartesInput{
        parte: String
        caracteristicas: [CaracteristicasInput]
    }

    input MaquinaInput{
        nombre: String
        caracteristicas: [CaracteristicasInput]
        partes: [PartesInput]
        categoria: ID
        ubicacion: ID
        vida_util: Number
        fecha_adquirido: Date
        estado: Estado
    }

    type RespuestaMaquina{
        estado: Boolean
        data: Maquina
        message: String
    }

    type Mutation{
        insertarMaquina(input:MaquinaInput):RespuestaMaquina
        actualizarMaquina(id:ID, input:MaquinaInput):RespuestaMaquina
        desactivarMaquina(id:ID):RespuestaMaquina
    }
`;

module.exports = maquina_type