import { Incidente } from '../models';

export default {
    Query: {
        obtenerIncidentes: async (_, { id }) => {
            try {
                const incidentes = await Incidente.find({ maquina: id }).populate('maquina').populate('ubicacion');
                return incidentes.sort(function (a, b) {
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
        obtenerIncidente: async (_, { id }) => {
            try {
                const incidente = await Incidente.findById(id).populate('maquina').populate('ubicacion');
                return incidente
            } catch (error) {
                return error;
            }
        }
    },
    Mutation: {
        insertarIncidente: async (_, { input }) => {
            try {
                const incidente = new Incidente(input);
                const result = await incidente.save();
                return {
                    estado: true,
                    data: result,
                    message: "El incidente fue registrado con éxito"
                };
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al registrar el incidente"
                };
            }
        },
        actualizarIncidente: async (_, { id, input }) => {
            try {
                const incidente = await Incidente.findOneAndUpdate({ _id: id }, input, { new: true });
                return {
                    estado: true,
                    data: incidente,
                    message: "El incidente fue actualizado con éxito"
                };
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al registrar el incidente"
                };
            }
        },
        desactivarIncidente: async (_, { id }) => {
            try {
                const incidente = await Incidente.findOneAndUpdate({ _id: id }, { estado: "INACTIVO" }, { new: true });
                if (incidente) {
                    return {
                        estado: true,
                        data: null,
                        message: "Incidente eliminado correctamente"
                    };
                } else {
                    return {
                        estado: false,
                        data: null,
                        message: "No se pudo eliminar el incidente"
                    };
                }
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al eliminar el incidente"
                };
            }
        }
    }
}