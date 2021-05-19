import { Rol } from "../models";

export default {
    Query: {
        obtenerRoles: async (_, { }) => {
            try {
                const roles = await Rol.find().populate('permisos');
                return roles;
            } catch (error) {
                return error;
            }
        }
    },
    Mutation: {
        insertarRol: async (_, { input }) => {
            try {
                const { tipo } = input;
                const existe = await Rol.findOne({ tipo });
                if (existe) {
                    return "El rol ya existe";
                } else {
                    const rol = new Rol(input);
                    const result = await rol.save();
                    return result;
                }
            } catch (error) {
                return error;
            }

        },
        actualizarRol: async (_, { id, input }) => {
            try {
                const rol = await Rol.findOneAndUpdate({ _id: id }, input, { new: true }).populate('permisos');
                return rol;
            } catch (error) {
                return error;
            }
        },
        desactivarRol: async (_, { id }) => {
            try {
                const rol = await Rol.findOneAndUpdate({ _id: id }, { estado: 'INACTIVO' }, { new: true });
                if (rol) {
                    return "Rol eliminado correctamente";
                } else {
                    return "No se pudo eliminar el rol";
                }
            } catch (error) {
                return error;
            }
        }
    }
}