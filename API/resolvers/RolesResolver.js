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
            const { tipo } = input;
            const existe = await Rol.findOne({ tipo });
            if (existe) {
                return "Ya existe el rol";
            } else {
                try {
                    const rol = new Rol(input);
                    const result = await rol.save();
                    return result;
                } catch (error) {
                    return error;
                }
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
                const rol = await Rol.findOneAndUpdate({_id: id}, {estado: 'INACTIVO'}, {new: true});
                if(rol){
                    return "Rol eliminado";
                }else{
                    return "El rol no pudo ser eliminado";
                }
            } catch (error) {
                return error;
            }
        }
    }
}