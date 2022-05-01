import { Insumos, MovimientosInsumo, Usuario, Rol } from "../models";
import nodemailer from 'nodemailer';

const crearNotifcaciones = (insumos) => {
    const date = new Date()
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
        "<h3 style='display: block; text-align: center;'>Notificación de Insumos</h3> " +
        "<div style='width: 90%; margin-left: auto; margin-right: auto; padding: 5px'> " +
        "fecha del aviso: " + fecha + "<br> Los siguiente insumos estan al limite o por debajo en cantidad en stock" +
        insumos +
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

const obtenerInsumos = async () => {
    let insumos_notificar = "", result, cant = 0;
    const insumos = await Insumos.find({estado: 'ACTIVO'})
    for(let i = 0; i < insumos.length; i++){
        cant = 0;
        result = await MovimientosInsumo.find({insumo: insumos[i].id})
        result.map(r => {
            if(r.tipo === 'ENTRADA'){
                cant += r.cantidad;
            }else{
                cant -= r.cantidad;
            }
        })
        console.log(cant, insumos[i].cantidad_limite)
        if(cant <= insumos[i].cantidad_limite){
            insumos_notificar += "<hr> Insumo: " + insumos[i].codigo + "<br>Descripción: " + insumos[i].descripcion
        }
    }
    return insumos_notificar
}

async function notificarInsumos() {
    const usuarios = await obtenerUsuarios()
    if (usuarios.length > 0) {
        const insumos = await obtenerInsumos()
        const contenido = crearNotifcaciones(insumos)
        if (insumos.length > 0) {
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
                subject: "Notificación de Insumos",
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

const interval = setInterval(notificarInsumos, 86400000)

export default {
    Query: {
        obtenerInsumos: async (_, { }) => {
            try {
                const insumos = await Insumos.find({ estado: 'ACTIVO' }).populate('area')
                return insumos.sort(function (a, b) {
                    if (a.codigo > b.codigo) {
                        return 1
                    }
                    if (a.codigo < b.codigo) {
                        return -1
                    }
                    return 0;
                });
            } catch (error) {
                return error
            }
        },
        obtenerInsumosConMovimientos: async (_, { }) => {
            try {
                var insumosmovimientos = []
                const insumos = await Insumos.find({ estado: 'ACTIVO' }).populate('area')
                insumos.map(item => {
                    const result = MovimientosInsumo.find({ insumo: item.id }).populate('usuario')
                    insumosmovimientos.push({
                        insumo: item,
                        movimientos: result
                    })
                })
                return insumosmovimientos.sort(function (a, b) {
                    if (a.insumo.codigo > b.insumo.codigo) {
                        return 1
                    }
                    if (a.insumo.codigo < b.insumo.codigo) {
                        return -1
                    }
                    return 0;
                });
            } catch (error) {
                return error;
            }
        },
        obtenerInsumo: async (_, { id }) => {
            try {
                const insumo = await Insumos.findById(id).populate('area')
                return insumo;
            } catch (error) {
                return error
            }
        }
    },
    Mutation: {
        insertarInsumo: async (_, { input }) => {
            try {
                const insumo = new Insumos(input);
                const result = await insumo.save();
                return {
                    estado: true,
                    data: result,
                    message: "El insumo fue registrado con éxito"
                };
            } catch (error) {
                console.log(error)
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al registrar el insumo"
                };
            }
        },
        actualizarInsumo: async (_, { id, input }) => {
            try {
                const insumo = await Insumos.findOneAndUpdate({ _id: id }, input, { new: true });
                return {
                    estado: true,
                    data: insumo,
                    message: "El insumo fue actualizado con éxito"
                };
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al registrar el insumo "
                };
            }
        },
        desactivarInsumo: async (_, { id }) => {
            try {
                const insumo = await Insumos.findOneAndUpdate({ _id: id }, { estado: "INACTIVO" }, { new: true });
                if (insumo) {
                    return {
                        estado: true,
                        data: null,
                        message: "Insumo  eliminado correctamente"
                    };
                } else {
                    return {
                        estado: false,
                        data: null,
                        message: "No se pudo eliminar el insumo "
                    };
                }
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al eliminar el insumo "
                };
            }
        }
    }
}