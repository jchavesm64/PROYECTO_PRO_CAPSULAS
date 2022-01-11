import { MovimientosProductos } from '../models';

export default {
    Query: {
        obtenerMovimientosProductos: async (_, { id }) => {
            try {
                const mov = await MovimientosProductos.find({ producto: id }).populate('usuario').populate('producto');
                return mov
            } catch (error) {
                return error;
            }
        }
    },
    Mutation: {
        insertarMovimientoProducto: async (_, { input }) => {
            try {
                const mov = new MovimientosProductos(input);
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
        }
    }
}