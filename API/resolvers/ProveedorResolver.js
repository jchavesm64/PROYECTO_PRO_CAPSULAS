import { Proveedor } from '../models';

export default {
    Query: {
        obtenerProveedores: async (_, { }) => {
            try {
                const proveedores = await Proveedor.find({ estado: "ACTIVO" }).populate('provedurias');
                return proveedores;
            } catch (error) {
                return error;
            }
        }
    },
    Mutation: {
        insertarProveedor: async (_, { input }) => {
            try {
                const { cedula } = input;
                const existe = Proveedor.findOne({ cedula });
                if (existe) {
                    return "El proveedor ya esta registrado";
                } else {
                    const proveedor = new Proveedor(input);
                    const result = proveedor.save();
                    return result;
                }
            } catch (error) {
                return error;
            }
        },
        actualizarProveedor: async (_, { id, input }) => {
            try {
                const proveedor = Proveedor.findOneAndUpdate({ _id: id }, input, { new: true });
                return proveedor;
            } catch (error) {
                return proveedor;
            }
        },
        desactivarProveedor: async (_, { id }) => {
            try {
                const proveedor = Proveedor.findOneAndUpdate({ _id: id }, { estado: "INACTIVO" }, { new: true });
                if (proveedor) {
                    return "Proveedor eliminado correctamente";
                } else {
                    return "No se pudo eliminar el porveedor";
                }
            } catch (error) {
                return error;
            }
        }
    }
}