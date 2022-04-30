import { MovimientosInsumo } from '../models';

export default {
    Query: {
        obtenerMovimientosDispensado: async (_, { id }) => {
            try {
                const mov = await MovimientosInsumo.find({ insumo: id }).populate('usuario').populate('dispensado');
                return mov
            } catch (error) {
                return error;
            }
        }
    },
    Mutation: {
        insertarMovimientoInsumo: async (_, { input }) => {
            try {
                const mov = new MovimientosInsumo(input);
                const result = await mov.save();
                return {
                    estado: true,
                    data: result,
                    message: "Se registro correctamente el movimiento"
                }
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al registrar el movimiento"
                }
            }
        },
    }
}