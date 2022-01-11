import { Mantenimiento } from '../models';

export default {
    Query: {
        obtenerMantenimientos: async (_, { id }) => {
            try {
                const maquinas = await Mantenimiento.find({ maquina: id, estado: "ACTIVO" }).populate('maquina');
                return maquinas.sort(function (a, b) {
                    if (a.nombre > b.nombre) {
                        return 1
                    }
                    if (a.nombre < b.nombre) {
                        return -1
                    }
                    return 0;
                });
            } catch (error) {
                return error;
            }
        },
    },
    Mutation: {
        insertarMantenimiento: async (_, { input }) => {
            try {
                const mantenimiento = new Mantenimiento(input);
                const result = await mantenimiento.save();
                return {
                    estado: true,
                    data: result,
                    message: "El mantenimiento fue registrado con éxito"
                };
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al registrar el mantenimiento"
                };
            }
        },
        actualizarMantenimiento: async (_, { id, input }) => {
            try {
                const mantenimiento = await Mantenimiento.findOneAndUpdate({ _id: id }, input, { new: true });
                return {
                    estado: true,
                    data: mantenimiento,
                    message: "El mantenimiento fue actualizado con éxito"
                };
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al registrar el mantenimiento"
                };
            }
        },
        desactivarMantenimiento: async (_, { id }) => {
            try {
                const mantenimiento = await Mantenimiento.findOneAndUpdate({ _id: id }, { estado: "INACTIVO" }, { new: true });
                if (mantenimiento) {
                    return {
                        estado: true,
                        data: null,
                        message: "Mantenimiento eliminado correctamente"
                    };
                } else {
                    return {
                        estado: false,
                        data: null,
                        message: "No se pudo eliminar el mantenimiento"
                    };
                }
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al eliminar el mantenimiento"
                };
            }
        }
    }
}