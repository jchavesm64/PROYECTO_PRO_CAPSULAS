import { Cotizacion, Movimientos } from "../models";
const mongoose = require('mongoose');

export default{
    Query:{
        obtenerCotizaciones: async (_, {}) => {
            try{
                const result = await Cotizacion.find().populate('formula').populate('elementos');
                return result;
            }catch(error){
                return error
            }
        },
        obtenerCotizacion: async (_, {id}) => {
            try{
                const result = await Cotizacion.findById(id).populate('formula').populate('elementos');
                return result;
            }catch(error){
                return error
            }
        }
    },
    Mutation:{
        insertarCotizacion: async (_, {input}) => {
            try{
                const cotizacion = new Cotizacion(input);
                await cotizacion.save()
                return{
                    estado: true,
                    message: "Cotizacíon generada con éxito"
                }
            }catch(error){
                console.log(error)
                return{
                    estado: false,
                    message: "Ocurrio un error al generar la cotizacíon"
                }
            }
        }
    }
}