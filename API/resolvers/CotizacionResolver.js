import { Cotizacion, Movimientos } from "../models";
const mongoose = require('mongoose');

export default{
    Query:{
        obtenerCotizaciones: async (_, {}) => {
            try{
                const result = await Cotizacion.find().populate('formula').populate('tipoProducto').populate('cliente').populate('elementos').populate('capsula');
                return result;
            }catch(error){
                return error
            }
        },
        obtenerCotizacion: async (_, {id}) => {
            try{
                const result = await Cotizacion.findById(id).populate('formula').populate('tipoProducto').populate('cliente').populate('elementos').populate('capsula');
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
        },
        actualizarCotizacion: async (_, {id, input}) => {
            try{
                const cliente = await Cliente.findOneAndUpdate({_id: id}, input, {new: true});
                return {
                    estado: true,
                    data: cliente,
                    message: "La cotización fue actualizado con éxito"
                };
            }catch(error){
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al actualizar la cotización"
                };
            }
        },
        desactivarCotizacion: async (_, {id}) => {
            try{
                const cliente = await Cliente.findOneAndUpdate({_id: id}, {estado: "INACTIVO"}, {new: true});
                if(cliente){
                    return {
                        estado: true,
                        data: null,
                        message: "Cotización eliminada correctamente"
                    };
                }else{
                    return {
                        estado: false,
                        data: null,
                        message: "No se pudo eliminar la cotización"
                    };
                }
            }catch(error){
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al eliminar el cliente"
                };
            }
        }
    }
}