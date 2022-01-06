import { MovimientoSeleccion } from '../models';

export default {
    Query: {
        obtenerMovimientosSeleccion: async (_, { id }) => {
            try {
                const mov = await MovimientoSeleccion.find({ seleccion: id }).populate('usuario').populate('seleccion');
                return mov
            } catch (error) {
                return error;
            }
        }
    },
    Mutation: {
        insertarMovimientoSeleccion: async (_, { input }) => {
            try {
                const mov = new MovimientoSeleccion(input);
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