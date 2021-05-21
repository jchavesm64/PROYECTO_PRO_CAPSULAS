import { Usuario } from "../models";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: "variables.env" });

const format = /^[a-zA-Z0-9]+$/;

const crearToken = (usuario, secreto, expiresIn) => {
    const { cedula } = usuario;
    return jwt.sign({ cedula }, secreto, { expiresIn })
}

export default {
    Query: {
        obtenerUsuariosActivos: async (_, { }) => {
            try {
                const usuarios = await Usuario.find({ estado: "ACTIVO" }).populate({path: 'roles', populate: [{path: 'permisos'}]});
                return usuarios;
            } catch (error) {
                return error;
            }
        },
        obtenerUsuarioAutenticado: async (root, args, {usuarioActual}) => {
            if(!usuarioActual){
                return null;
            }
            const usuario = await Usuario.findOne({cedula: usuarioActual.cedula}).populate({path: 'roles', populate: [{path: 'permisos'}]});
            return usuario;
        }
    },
    Mutation: {
        autenticarUsuario: async (_, {cedula, clave}) => {
            try{
                const existe = await Usuario.findOne({cedula}).populate('roles');
                if(!existe){
                    return "No existe un usuario con esas credenciales";
                }else{
                    const valid = await bcrypt.compare(clave, existe.clave);
                    if(!valid){
                        return "La contraseña es incorrecta";
                    }else{
                        return {
                            success: true,
                            token: await crearToken(existe, process.env.SECRETO, "1hr")
                        }
                    }
                }
            }catch(error){
                return error;
            }
        },
        insertarUsuario: async (_, { input }) => {
            try {
                const { cedula } = input;
                if (format.test(cedula)) {
                    const existe = await Usuario.findOne({ cedula });
                    if (existe) {
                        return "El usuario ya existe";
                    } else {
                        var clave = input.clave;
                        var clave_enc = await bcrypt.hash(clave, 10);
                        input.clave = clave_enc;
                        const usuario = new Usuario(input);
                        const result = await usuario.save();
                        return result;
                    }
                }else{
                    return "La cédula solo debe contener numeros y letras";
                }
            } catch (error) {
                return error;
            }
        },
        actualizarUsuario: async (_, {id, input}) => {
            try{
                const usuario = await Usuario.findOneAndUpdate({_id: id}, input, { new: true }).populate('roles');
                return usuario;
            }catch(error){
                return error;
            }
        },
        desactivarUsuario: async (_, { id }) => {
            try {
                const usuario = await Usuario.findOneAndUpdate({ _id: id }, { estado: 'INACTIVO' }, { new: true });
                if (usuario) {
                    return "Usuario eliminado correctamente";
                } else {
                    return "No se pudo eliminar el usuario";
                }
            } catch (error) {
                return error;
            }
        }
    }
}