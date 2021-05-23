import { TipoProducto } from '../models';

export default {
    Query: {
        obtenerTipoProductos: async (_, { }) => {
            try {
                const tipos = await TipoProducto.find({ estado: "ACTIVO" });
                return tipos;
            } catch (error) {
                return error;
            }
        }
    },
    Mutation: {
        insertarTipoProductos: async (_, { input }) => {
            try {
                const { tipo } = input;
                const existe = await TipoProducto.findOne({ tipo });
                if (existe) {
                    return "El tipo de producto ya esta registrado";
                } else {
                    const tipoProducto = new TipoProducto(input);
                    const result = tipoProducto.save();
                    return result;
                }
            } catch (error) {
                return error;
            }
        },
        actualizarTipoProductos: async (_, { id, input }) => {
            try {
                const tipo = await TipoProducto.findOneAndUpdate({ _id: id }, input, { new: true });
                return tipo;
            } catch (error) {
                return error;
            }
        },
        desactivarTipoProducto: async (_, { id }) => {
            try {
                const tipo = await TipoProducto.findOneAndUpdate({ _id: id }, { estado: 'INACTIVO' }, { new: true });
                if (tipo) {
                    return "Tipo de producto eliminado correctamente";
                } else {
                    return "No se pudo eliminar el tipo de producto";
                }
            } catch (error) {
                return error;
            }
        }
    }
}