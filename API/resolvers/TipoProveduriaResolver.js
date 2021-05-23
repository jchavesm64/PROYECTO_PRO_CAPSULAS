import { TipoProveduria } from '../models';

export default {
    Query: {
        obtenerTipoProveduria: async (_, { }) => {
            try {
                const tipos = await TipoProveduria.find({ estado: "ACTIVO" });
                return tipos;
            } catch (error) {
                return error;
            }
        }
    },
    Mutation: {
        insertarTipoProveduria: async (_, { input }) => {
            try {
                const { tipo } = input;
                const existe = TipoProveduria.findOne({ tipo });
                if (existe) {
                    return "El tipo de proveduria ya existe";
                } else {
                    const tipoProveduria = new TipoProveduria(input);
                    const result = tipoProveduria.save();
                    return result;
                }
            } catch (error) {
                return error;
            }
        },
        actualizarTipoProveduria: async (_, { id, input }) => {
            try {
                const tipo = TipoProveduria.findOneAndUpdate({ _id: id }, input, { new: true });
                return tipo;
            } catch (error) {
                return error;
            }
        },
        desactivarTipoProveduria: async (_, { id }) => {
            try {
                const tipo = await TipoProveduria.findOneAndUpdate({ _id: id }, { estado: 'INACTIVO' }, { new: true });
                if (tipo) {
                    return "Tipo de proveduria eliminado correctamente";
                } else {
                    return "No se pudo eliminar el tipo de proveduria ";
                }
            } catch (error) {
                return error;
            }
        }
    }
}