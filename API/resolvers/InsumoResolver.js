import { Insumos, MovimientosInsumo } from "../models";

export default {
    Query: {
        obtenerInsumos: async (_, { }) => {
            try {
                const insumos = await Insumos.find({ estado: 'ACTIVO' }).populate('area')
                return insumos.sort(function (a, b) {
                    if (a.codigo > b.codigo) {
                        return 1
                    }
                    if (a.codigo < b.codigo) {
                        return -1
                    }
                    return 0;
                });
            } catch (error) {
                return error
            }
        },
        obtenerInsumosConMovimientos: async (_, { }) => {
            try {
                var insumosmovimientos = []
                const insumos = await Insumos.find({ estado: 'ACTIVO' }).populate('area')
                insumos.map(item => {
                    const result = MovimientosInsumo.find({ insumo: item.id }).populate('usuario')
                    insumosmovimientos.push({
                        insumo: item,
                        movimientos: result
                    })
                })
                return insumosmovimientos.sort(function (a, b) {
                    if (a.insumo.codigo > b.insumo.codigo) {
                        return 1
                    }
                    if (a.insumo.codigo < b.insumo.codigo) {
                        return -1
                    }
                    return 0;
                });
            } catch (error) {
                return error;
            }
        },
        obtenerInsumo: async (_, { id }) => {
            try {
                const insumo = await Insumos.findById(id).populate('area')
                return insumo;
            } catch (error) {
                return error
            }
        }
    },
    Mutation: {
        insertarInsumo: async (_, { input }) => {
            try {
                const insumo = new Insumos(input);
                const result = await insumo.save();
                return {
                    estado: true,
                    data: result,
                    message: "El insumo fue registrado con éxito"
                };
            } catch (error) {
                console.log(error)
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al registrar el insumo"
                };
            }
        },
        actualizarInsumo: async (_, { id, input }) => {
            try {
                const insumo = await Insumos.findOneAndUpdate({ _id: id }, input, { new: true });
                return {
                    estado: true,
                    data: insumo,
                    message: "El insumo fue actualizado con éxito"
                };
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al registrar el insumo "
                };
            }
        },
        desactivarInsumo: async (_, { id }) => {
            try {
                const insumo = await Insumos.findOneAndUpdate({ _id: id }, { estado: "INACTIVO" }, { new: true });
                if (insumo) {
                    return {
                        estado: true,
                        data: null,
                        message: "Insumo  eliminado correctamente"
                    };
                } else {
                    return {
                        estado: false,
                        data: null,
                        message: "No se pudo eliminar el insumo "
                    };
                }
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al eliminar el insumo "
                };
            }
        }
    }
}