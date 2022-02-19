import { Maquina, Incidente, Mantenimiento, Usuario, Rol } from '../models';
import nodemailer from 'nodemailer';

const crearNotifcaciones = (maquinas) => {
    const date = new Date()
    date.setMonth(date.getMonth() + 3)
    const day = (date.getDate() < 9) ? '0' + date.getDate() : date.getDate()
    const month = (date.getMonth() < 9) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
    const fecha = day + " - " + month + " - " + date.getFullYear()
    return "<!DOCTYPE html> " +
        "<html lang='en'> " +
        "<head> " +
        "<meta charset='UTF-8'> " +
        "<meta http-equiv='X-UA-Compatible' content='IE=edge'> " +
        "<meta name='viewport' content='width=device-width, initial-scale=1.0'> " +
        "<title>Sistema ProCápsulas</title> " +
        "</head> " +
        "<body> " +
        "<div style='min-width: 300px; max-width: 600px; margin-left: auto; margin-right: auto; margin-top: 5px; border-radius: 25px 25px 0px 0px; background-color: #ebe9e9;'> " +
        "<img style='display: block; width: 90%; margin-left: auto; margin-right: auto; padding-top: 20px;' src='https://i1.wp.com/procapsulas.com/wp-content/uploads/2021/02/Recurso-1.png?w=3773&ssl=1%203773w,%20https://i1.wp.com/procapsulas.com/wp-content/uploads/2021/02/Recurso-1.png?resize=300%2C56&ssl=1%20300w,%20https://i1.wp.com/procapsulas.com/wp-content/uploads/2021/02/Recurso-1.png?resize=1024%2C191&ssl=1%201024w,%20https://i1.wp.com/procapsulas.com/wp-content/uploads/2021/02/Recurso-1.png?resize=768%2C144&ssl=1%20768w,%20https://i1.wp.com/procapsulas.com/wp-content/uploads/2021/02/Recurso-1.png?resize=1536%2C287&ssl=1%201536w,%20https://i1.wp.com/procapsulas.com/wp-content/uploads/2021/02/Recurso-1.png?resize=2048%2C383&ssl=1%202048w,%20https://i1.wp.com/procapsulas.com/wp-content/uploads/2021/02/Recurso-1.png?resize=1568%2C293&ssl=1%201568w,%20https://i1.wp.com/procapsulas.com/wp-content/uploads/2021/02/Recurso-1.png?w=2400&ssl=1%202400w'> " +
        "<h2 style='display: block; text-align: center;'>Sistema ProCápsulas</h2> " +
        "<h3 style='display: block; text-align: center;'>Notificación de Mantenimientos en Máquinas</h3> " +
        "<div style='width: 90%; margin-left: auto; margin-right: auto; padding: 5px'> " +
        "fecha del Mantenimiento: " + fecha +
        maquinas +
        "</div> " +
        "</div> " +
        "<footer style='background-color: #d1d0d0; min-width: 300px; max-width: 600px; margin-left: auto; margin-right: auto; border-radius: 0px 0px 25px 25px; min-height: 50px;'> " +
        "<h3 style='margin: 0px; display: block; text-align: center; padding-top: 15px; color: black;'>Sistema ProCápsulas</h3> " +
        "</footer> " +
        "</body> " +
        "</html>"
}

const obtenerUsuarios = async () => {
    const rol = await Rol.findOne({ tipo: 'ADMINISTRADOR' })
    const emails = []
    if (rol) {
        const usuarios = await Usuario.find({ estado: "ACTIVO", roles: { $in: [rol] } }).populate('roles')
        usuarios.map(u => {
            if (u.correos.length > 0) {
                emails.push(u.correos[0].email)
            }
        })
    }
    return emails
}

const obtenerMaquinas = async () => {
    const date = new Date()
    date.setMonth(date.getMonth() + 3)
    date.setHours(-6); date.setMinutes(0); date.setSeconds(0); date.setMilliseconds(0);
    console.log(date)
    const maquinas = await Mantenimiento.find({ fecha_mantenimiento: { $eq: date } }).populate('maquina')
    let info_maquinas = ''
    maquinas.map(m => {
        if (m.maquina.estado === 'ACTIVO') {
            info_maquinas += "<hr> Máquina: " + m.maquina.nombre + "<br>Descripcion: " + m.descripcion
        }
    })
    return info_maquinas
}

async function notificarMantenimientos() {
    const usuarios = await obtenerUsuarios()
    console.log(usuarios)
    if (usuarios.length > 0) {
        const maquinas = await obtenerMaquinas()
        const contenido = crearNotifcaciones(maquinas)
        if (contenido.length > 0) {
            let transporte = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: "sistema.procapsulas@gmail.com",
                    pass: "udbkmyrslbxhtrgm"
                }
            })
            let enviar = ''
            usuarios.map(c => {
                enviar += c + ";"
            })
            let mailOptions = {
                from: "sistema.procapsulas@gmail.com",
                to: enviar,
                subject: "Notificación de Mantenimientos de las Máquinas",
                html: contenido
            }
            transporte.sendMail(mailOptions, (error) => {
                if (error) {
                    console.log(error)
                }
            });
        }
    }
}

const interval = setInterval(notificarMantenimientos, 86400000)

export default {
    Query: {
        obtenerMaquinas: async (_, { }) => {
            try {
                const maquinas = await Maquina.find({ estado: "ACTIVO" }).populate('categoria').populate('ubicacion');
                return maquinas.sort(function (a, b) {
                    if (a.nombre > b.nombre) {
                        return 1
                    }
                    if (a.nombre < b.nombre) {
                        return -1
                    }
                    return 0;
                });
            } catch (error) {
                return error;
            }
        },
        obtenerMaquina: async (_, { id }) => {
            try {
                const maquina = await Maquina.findById(id).populate('categoria').populate('ubicacion');
                return maquina;
            } catch (error) {
                return error;
            }
        },
        obtenerInformacionMaquina: async (_, { id }) => {
            try {
                const maquina = await Maquina.findById(id).populate('categoria').populate('ubicacion');
                const incidentes = await Incidente.find({ maquina: maquina.id }).populate('ubicacion');
                const mantenimientos = await Mantenimiento.find({ maquina: maquina.id });
                return {
                    maquina,
                    incidentes,
                    mantenimientos
                }
            } catch (error) {
                return error
            }
        }
    },
    Mutation: {
        insertarMaquina: async (_, { input }) => {
            try {
                const maquina = new Maquina(input);
                const result = await maquina.save();
                return {
                    estado: true,
                    data: result,
                    message: "La maquina fue registrado con éxito"
                };
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al registrar la maquina"
                };
            }
        },
        actualizarMaquina: async (_, { id, input }) => {
            try {
                const maquina = await Maquina.findOneAndUpdate({ _id: id }, input, { new: true });
                return {
                    estado: true,
                    data: maquina,
                    message: "La maquina fue actualizado con éxito"
                };
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al registrar la maquina"
                };
            }
        },
        desactivarMaquina: async (_, { id }) => {
            try {
                const maquina = await Maquina.findOneAndUpdate({ _id: id }, { estado: "INACTIVO" }, { new: true });
                if (maquina) {
                    return {
                        estado: true,
                        data: null,
                        message: "Maquina eliminado correctamente"
                    };
                } else {
                    return {
                        estado: false,
                        data: null,
                        message: "No se pudo eliminar la maquina"
                    };
                }
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al eliminar la maquina"
                };
            }
        }
    }
}