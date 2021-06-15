import { Movimientos } from '../models';

export default {
    Query: {
        obtenerMovimientos: async (_, { id }) => {
            try {
                const mov = await Movimientos.find({ materia_prima: id }).populate('usuario').populate('materia_prima');
                return mov;
            } catch (error) {
                return error;
            }
        }
    },
    Mutation: {
        insertarMovimiento: async (_, { input }) => {
            try{
                const mov = new Movimientos(input);
                const result = await mov.save();
                return {
                    estado: true,
                    data: result,
                    message: "Se registro correctamente el movimiento"
                }
            }catch(error){
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al registrar el movimiento"
                }
            }
        }
    }
}