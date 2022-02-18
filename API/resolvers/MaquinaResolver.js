import { Maquina, Incidente, Mantenimiento } from '../models';

export default {
    Query: {
        obtenerMaquinas: async (_, { }) => {
            try {
                const maquinas = await Maquina.find({ estado: "ACTIVO" }).populate('categoria').populate('ubicacion');
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
        obtenerMaquina: async (_, { id }) => {
            try {
                const maquina = await Maquina.findById(id).populate('categoria').populate('ubicacion');
                return maquina;
            } catch (error) {
                return error;
            }
        },
        obtenerInformacionMaquina: async (_, { id }) => {
            try{
                const maquina = await Maquina.findById(id).populate('categoria');
                const incidentes = await Incidente.find({maquina: maquina.id});
                const mantenimientos = await Mantenimiento.find({maquina: maquina.id});
                return {
                    maquina,
                    incidentes,
                    mantenimientos
                }
            }catch(error){
                return error
            }
        }
    },
    Mutation: {
        insertarMaquina: async (_, { input }) => {
            try {
                const maquina = new Maquina(input);
                const result = await maquina.save();
                return {
                    estado: true,
                    data: result,
                    message: "La maquina fue registrado con éxito"
                };
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al registrar la maquina"
                };
            }
        },
        actualizarMaquina: async (_, { id, input }) => {
            try {
                const maquina = await Maquina.findOneAndUpdate({ _id: id }, input, { new: true });
                return {
                    estado: true,
                    data: maquina,
                    message: "La maquina fue actualizado con éxito"
                };
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al registrar la maquina"
                };
            }
        },
        desactivarMaquina: async (_, { id }) => {
            try {
                const maquina = await Maquina.findOneAndUpdate({ _id: id }, { estado: "INACTIVO" }, { new: true });
                if (maquina) {
                    return {
                        estado: true,
                        data: null,
                        message: "Maquina eliminado correctamente"
                    };
                } else {
                    return {
                        estado: false,
                        data: null,
                        message: "No se pudo eliminar la maquina"
                    };
                }
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al eliminar la maquina"
                };
            }
        }
    }
}