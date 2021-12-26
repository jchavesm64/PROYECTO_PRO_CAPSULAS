import {Puesto} from '../models'

export default {
    Query : {
        obtenerPuestos: async (_, {}) => {
            try {
                const puestos = await Puesto.find({estado: 'ACTIVO'});
                return puestos.sort(function(a, b){
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
        insertarPuesto: async (_, { input }) => {
            try {
                const { nombre } = input;
                const existe = await Puesto.findOne({ nombre });
                if (existe) {
                    return {
                        estado: true,
                        data: null,
                        message: "El puesto ya existe"
                    };
                } else {
                    const puesto = new Puesto(input);
                    const result = await puesto.save();
                    return {
                        estado: true,
                        data: result,
                        message: "Puesto creado con exito"
                    }
                }
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error inesperado al registrar el puesto"
                };
            }
        },
        actualizarPuesto: async (_, { id, input }) => {
            try {
                const puesto = await Puesto.findOneAndUpdate({ _id: id }, input, { new: true });
                return {
                    estado: true,
                    data: puesto,
                    message: "Puesto actualizado correctamente"
                };
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error inesperado al actualizar el puesto"
                };
            }
        },
        desactivarPuesto: async (_, { id }) => {
            try {
                const puesto = await Puesto.findOneAndUpdate({ _id: id }, { estado: 'INACTIVO' }, { new: true });
                if (puesto) {
                    return {
                        estado: true,
                        data: null,
                        message: "Puesto eliminado correctamente"
                    };
                } else {
                    return {
                        estado: false,
                        data: null,
                        message: "No se pudo eliminar el puesto"
                    };
                }
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error inesperado al eliminar el puesto"
                };
            }
        }
    }
}