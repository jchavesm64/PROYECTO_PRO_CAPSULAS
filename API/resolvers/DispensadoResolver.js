import { Dispensado } from '../models'
import { MovimientoDispensado } from '../models';

export default {
    Query: {
        obtenerDispensados: async (_, { }) => {
            try {
                const dispensados = await Dispensado.find({ estado: 'ACTIVO' }).populate('producto')
                return dispensados.sort(function(a, b){
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
        obtenerDispensadoConMovimientos: async (_, { }) => {
            try {
                var dispensadomovimientos = []
                const dispensados = await Dispensado.find({ estado: 'ACTIVO' }).populate('producto')
                dispensados.map(item => {
                    const result = MovimientoDispensado.find({dispensado: item.id}).populate('usuario')
                    dispensadomovimientos.push({
                        dispensado: item,
                        movimientos: result
                    })
                })
                return dispensadomovimientos.sort(function(a, b){
                    if(a.dispensado.nombre > b.dispensado.nombre){
                        return 1
                    }
                    if(a.dispensado.nombre < b.dispensado.nombre){
                        return -1
                    }
                    return 0;
                });
            } catch (error) {
                return error;
            }
        },
        obtenerDispensado: async (_, { id }) => {
            try {
                const dispensado = await Dispensado.findById(id).populate('producto')
                return dispensado;
            } catch (error) {

            }
        }
    },
    Mutation: {
        insertarDispensado: async (_, { input }) => {
            try {
                const dispensado = new Dispensado(input);
                const result = await dispensado.save();
                return {
                    estado: true,
                    data: result,
                    message: "La dispensado fue registrado con éxito"
                };
            } catch (error) {
                console.log(error)
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al registrar el dispensado"
                };
            }
        },
        actualizarDispensado: async (_, { id, input }) => {
            try {
                const dispensado = await Dispensado.findOneAndUpdate({ _id: id }, input, { new: true });
                return {
                    estado: true,
                    data: dispensado,
                    message: "La dispensado fue actualizado con éxito"
                };
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al registrar el dispensado "
                };
            }
        },
        desactivarDispensado: async (_, { id }) => {
            try {
                const dispensado = await Dispensado.findOneAndUpdate({ _id: id }, { estado: "INACTIVO" }, { new: true });
                if (dispensado) {
                    return {
                        estado: true,
                        data: null,
                        message: "Dispensado  eliminado correctamente"
                    };
                } else {
                    return {
                        estado: false,
                        data: null,
                        message: "No se pudo eliminar el dispensado "
                    };
                }
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al eliminar el dispensado "
                };
            }
        }
    }
}