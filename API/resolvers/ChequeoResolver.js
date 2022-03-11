import { Chequeo } from "../models";

export default {
    Query: {
        obtenerChequeos: async (_, { id, fecha1, fecha2 }) => {
            try {
                const chequeos = await Chequeo.find({ puesto_limpieza: id, $or: [{ fecha: { $eq: fecha1 } }, { fecha: { $eq: fecha2 } }] }).populate('puesto_limpieza')
                return chequeos
            } catch (error) {
                return error
            }
        },
        obtenerChequeo: async (_, { id, fecha }) => {
            try {
                const chequeo = await Chequeo.findOne({ puesto_limpieza: id, fecha: { $eq: fecha } }).populate('puesto_limpieza')
                if(chequeo){
                    return {
                        chequeo: chequeo,
                        estado: 1
                    }
                }
                return {
                    chequeo: null,
                    estado: 2
                }
            } catch (error) {
                return {
                    chequeo: null,
                    estado: 3
                }
            }
        }
    },
    Mutation: {
        insertarChequeo: async (_, { input }) => {
            try {
                const chequeo = new Chequeo(input)
                await chequeo.save()
                return {
                    estado: true,
                    message: 'El chequeo fue registrado correctamente'
                }
            } catch (error) {
                return {
                    estado: false,
                    message: "Ocurrio un error al registrar el producto"
                };
            }
        },
        actualizarChequeo: async (_, { id, input }) => {
            try {
                await Chequeo.findOneAndUpdate({_id: id}, input, {new: true});
                return {
                    estado: true,
                    message: 'El chequeo fue actualizada correctamente'
                }
            } catch (error) {
                return {
                    estado: false,
                    message: "Ocurrio un error al registrar el producto"
                };
            }
        },
        aprobarChequeo: async (_, { id }) => {
            try{
                const chequeo = await Chequeo.findOneAndUpdate({_id: id}, {aprobado: "APROBADO"}, {new: true})
                if (chequeo) {
                    return {
                        estado: true,
                        data: null,
                        message: "Chequeo aprobado correctamente"
                    };
                } else {
                    return {
                        estado: false,
                        data: null,
                        message: "No se pudo aprobar el chequeo"
                    };
                }
            }catch(error){
                return {
                    estado: false,
                    message: "Ocurrio un error al aprobar el chequeo"
                }
            }
        }
    }
}