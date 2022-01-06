import { Seleccion } from '../models'
import { MovimientoSeleccion } from '../models';

export default {
    Query: {
        obtenerSelecciones: async (_, { }) => {
            try {
                const seleccions = await Seleccion.find({ estado: 'ACTIVO' })
                return seleccions.sort(function(a, b){
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
        },
        obtenerSeleccionConMovimientos: async (_, { }) => {
            try {
                var seleccionmovimientos = []
                const seleccions = await Seleccion.find({ estado: 'ACTIVO' })
                seleccions.map(item => {
                    const result = MovimientoSeleccion.find({seleccion: item.id}).populate('usuario')
                    seleccionmovimientos.push({
                        seleccion: item,
                        movimientos: result
                    })
                })
                return seleccionmovimientos.sort(function(a, b){
                    if(a.seleccion.nombre > b.seleccion.nombre){
                        return 1
                    }
                    if(a.seleccion.nombre < b.seleccion.nombre){
                        return -1
                    }
                    return 0;
                });
            } catch (error) {
                return error;
            }
        },
        obtenerSeleccion: async (_, { id }) => {
            try {
                const seleccion = await Seleccion.findById(id);
                return seleccion;
            } catch (error) {

            }
        }
    },
    Mutation: {
        insertarSeleccion: async (_, { input }) => {
            try {
                const seleccion = new Seleccion(input);
                const result = await seleccion.save();
                return {
                    estado: true,
                    data: result,
                    message: "La seleccion fue registrado con éxito"
                };
            } catch (error) {
                console.log(error)
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al registrar el seleccion"
                };
            }
        },
        actualizarSeleccion: async (_, { id, input }) => {
            try {
                const seleccion = await Seleccion.findOneAndUpdate({ _id: id }, input, { new: true });
                return {
                    estado: true,
                    data: seleccion,
                    message: "La seleccion fue actualizado con éxito"
                };
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al registrar el seleccion "
                };
            }
        },
        desactivarSeleccion: async (_, { id }) => {
            try {
                const seleccion = await Seleccion.findOneAndUpdate({ _id: id }, { estado: "INACTIVO" }, { new: true });
                if (seleccion) {
                    return {
                        estado: true,
                        data: null,
                        message: "Seleccion  eliminado correctamente"
                    };
                } else {
                    return {
                        estado: false,
                        data: null,
                        message: "No se pudo eliminar el seleccion "
                    };
                }
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al eliminar el seleccion "
                };
            }
        }
    }
}