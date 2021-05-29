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
                const usuarios = await Usuario.find({ estado: "ACTIVO" }).populate({ path: 'roles', populate: [{ path: 'permisos' }] });
                return usuarios;
            } catch (error) {
                return error;
            }
        },
        obtenerUsuarioAutenticado: async (root, args, { usuarioActual }) => {
            if (!usuarioActual) {
                return {
                    estado: false,
                    data: null,
                    message: ""
                }
            }
            const usuario = await Usuario.findOne({ cedula: usuarioActual.cedula }).populate({ path: 'roles', populate: [{ path: 'permisos' }] });
            return {
                estado: true,
                data: usuario,
                message: ""
            };
        }
    },
    Mutation: {
        autenticarUsuario: async (_, { cedula, clave }) => {
            try {
                const existe = await Usuario.findOne({ cedula }).populate('roles');
                if (!existe) {
                    return {
                        token: "0",
                        mensaje: "No existe un usuario con esas credenciales"
                    };
                } else {
                    const valid = await bcrypt.compare(clave, existe.clave);
                    if (!valid) {
                        return {
                            token: "0",
                            mensaje: "La contraseña es incorrecta"
                        };
                    } else {
                        return {
                            token: await crearToken(existe, process.env.SECRETO, "1hr"),
                            mensaje: "Usuario correcto"
                        }
                    }
                }
            } catch (error) {
                return {
                    token: "0",
                    mensaje: "Error inesperado"
                };
            }
        },
        insertarUsuario: async (_, { input }) => {
            try {
                const { cedula } = input;
                if (format.test(cedula)) {
                    const existe = await Usuario.findOne({ cedula });
                    if (existe) {
                        return {
                            estado: false,
                            data: null,
                            message: "El usuario ya existe"
                        };
                    } else {
                        var clave = input.clave;
                        var clave_enc = await bcrypt.hash(clave, 10);
                        input.clave = clave_enc;
                        const usuario = new Usuario(input);
                        const result = await usuario.save();
                        return {
                            estado: true,
                            data: result,
                            message: "Usuario agregado correctamente"
                        };
                    }
                } else {
                    return {
                        estado: false,
                        data: null,
                        message: "La cédula solo debe contener numeros y letras"
                    };
                }
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error inesperado al guardar el usuario"
                };
            }
        },
        actualizarUsuario: async (_, { id, input }) => {
            try {
                const usuario = await Usuario.findOneAndUpdate({ _id: id }, input, { new: true }).populate('roles');
                return {
                    estado: true,
                    data: usuario,
                    message: "Usuario actualizado correctamente"
                };
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error inesperado al actualizar el usuario"
                };
            }
        },
        desactivarUsuario: async (_, { id }) => {
            try {
                const usuario = await Usuario.findOneAndUpdate({ _id: id }, { estado: 'INACTIVO' }, { new: true });
                if (usuario) {
                    return {
                        estado: true,
                        data: null,
                        message: "Usuario eliminado correctamente"
                    };
                } else {
                    return {
                        estado: false,
                        data: null,
                        message: "No se pudo eliminar el usuario"
                    };
                }
            } catch (error) {
                return error;
            }
        },
        cambiarClave: async (_, { id, actual, nueva }) => {
            try {
                const usuario = Usuario.findOne({ _id: id });
                if (usuario) {
                    const valid = await bcrypt.compare(actual, usuario.clave);
                    if (valid) {
                        var clave_enc = await bcrypt.hash(nueva, 10);
                        const result = await Usuario.findOneAndUpdate({ _id: id }, { clave: clave_enc }, { new: true });
                        if (result) {
                            return {
                                success: true,
                                message: "Contraseña cambiada correctamente"
                            }
                        } else {
                            return {
                                success: false,
                                message: "No se puedo cambiar la contraseña"
                            }
                        }
                    } else {
                        return {
                            success: false,
                            message: "La contraseña actual no es correcto"
                        }
                    }
                } else {
                    return {
                        success: false,
                        message: "No existe el usuario"
                    }
                }
            } catch (error) {
                return {
                    success: false,
                    message: "Error inesperado"
                }
            }
        },
        recuperarClave: async (_, { id, nueva }) => {
            try {
                var clave_enc = await bcrypt.hash(nueva, 10);
                const result = await Usuario.findOneAndUpdate({ _id: id }, { clave: clave_enc }, { new: true });
                if (result) {
                    return {
                        success: true,
                        message: "Contraseña cambiada correctamente"
                    }
                } else {
                    return {
                        success: false,
                        message: "No se puedo cambiar la contraseña"
                    }
                }
            } catch (error) {
                return {
                    success: false,
                    message: "Error inesperado"
                }
            }
        }
    }
}