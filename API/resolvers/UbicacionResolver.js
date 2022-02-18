import { Ubicacion } from '../models';

export default {
    Query: {
        obtenerUbicaciones: async (_, { }) => {
            try {
                const ubicacions = await Ubicacion.find({ estado: "ACTIVO" });
                return ubicacions.sort(function(a, b){
                    if(a.nombre > b.nombre){
                        return 1
                    }
                    if(a.nombre < b.nombre){
                        return -1
                    }
                    return 0;
                });
            } catch (error) {
                return error;
            }
        }
    },
    Mutation: {
        insertarUbicacion: async (_, { input }) => {
            try {
                const { nombre } = input;
                const existe = await Ubicacion.findOne({ nombre });
                if (existe) {
                    return {
                        estado: false,
                        data: null,
                        message: "La ubicacion ya existe"
                    }
                } else {
                    const ubicacion = new Ubicacion(input);
                    const result = await ubicacion.save();
                    return {
                        estado: true,
                        data: result,
                        message: "Ubicacion agregada correctamente"
                    }
                }
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error inesperado al registrar la ubicacion"
                }
            }
        },
        actualizarUbicacion: async (_, { id, input }) => {
            try {
                const ubicacion = await Ubicacion.findOneAndUpdate({ _id: id }, input, { new: true });
                return {
                    estado: true,
                    data: ubicacion,
                    message: "Ubicacion, actualizada correctamente"
                }
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error inesperado al actualizar la ubicacion"
                }
            }
        },
        desactivarUbicacion: async (_, { id }) => {
            try {
                const ubicacion = await Ubicacion.findOneAndUpdate({ _id: id }, { estado: 'INACTIVO' }, { new: true });
                if (ubicacion) {
                    return {
                        estado: true,
                        data: null,
                        message: "Ubicacion eliminada correctamente"
                    };
                } else {
                    return {
                        estado: false,
                        data: null,
                        message: "No se pudo eliminar la ubicacion"
                    }
                }
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio en error inesperado al eliminar la ubicacion"
                }
            }
        }
    }
}