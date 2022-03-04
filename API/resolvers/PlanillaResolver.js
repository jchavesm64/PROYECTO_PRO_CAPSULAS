import { Planilla, Personal } from "../models";
const mongoose = require('mongoose');

export default {
    Query: {
        obtenerPlanilla: async (_, { f1, f2 }) => {
            try {
                const planilla = await Planilla.findOne({ fecha_lunes: { $eq: f1 }, fecha_domingo: { $eq: f2 } });
                const { _id, fecha_lunes, fecha_domingo, listado_horas } = planilla
                const list_hours = []
                let emp = null, i = null
                for (let a = 0; a < listado_horas.length; a++) {
                    i = listado_horas[a]
                    emp = await Personal.findOne({ cedula: i.empleado }).populate('puesto')
                    list_hours.push({
                        empleado: emp,
                        horas: i.horas,
                        tipo: i.tipo
                    })
                }
                const result = {
                    id: _id,
                    fecha_lunes: fecha_lunes,
                    fecha_domingo: fecha_domingo,
                    listado_horas: list_hours
                }
                return result
            } catch (error) {
                console.log(error)
                return error;
            }
        }
    },
    Mutation: {
        savePlanilla: async (_, { input }) => {
            try {
                const { fecha_lunes, fecha_domingo, listado_horas } = input
                const planilla = await Planilla.findOne({ fecha_lunes: { $eq: fecha_lunes }, fecha_domingo: { $eq: fecha_domingo } });
                if (planilla) {
                    return {
                        estado: false,
                        message: "Ya se hizo una carga de horas en ese rango de fechas"
                    };
                } else {
                    let aux = null, emp = null, message = "Error al ingresar las horas", error = false
                    for (let a = 0; a < listado_horas.length; a++) {
                        aux = listado_horas[a].empleado
                        emp = await Personal.findOne({ cedula: aux })
                        if (!emp) {
                            error = true
                            message = "\nEl empleado de cédula " + aux + " no fue encontrado";
                        }
                    }
                    if (error) {
                        return {
                            estado: false,
                            message: message
                        };
                    } else {
                        const planilla = new Planilla(input)
                        await planilla.save()
                        return {
                            estado: true,
                            message: "Horas registradas correctamente"
                        };
                    }
                }
            } catch (error) {
                return {
                    estado: false,
                    message: "Ocurrio un error al registrar el colaborador"
                };
            }
            /* 
            const {horas} = input
            const session = await mongoose.startSession()
            session.startTransaction()
            let message_error = 'Ocurrio un error al registrar las horas\n', per = null, i = null;
            try{
                const opts = { session, new: true }
                for(let a = 0; a < horas.length; a++){
                    i = horas[a]
                    per = await Personal.findOne({cedula: i.empleado}).populate('puesto')
                    console.log(per)
                    if(per){
                        let horas = {
                            empleado: per.id,
                            horas: i.horas,
                            costo_hora: i.costos_horas === 0 ? per.puesto.salario : i.costo_hora,
                            detalle: i.detalle,
                            tipo: i.tipo,
                            fecha: i.fecha
                        }
                        let new_hora = new Planilla(horas)
                        await new_hora.save()
                    }else{
                        message_error += 'El empleado de cedula: ' + i[0] + ' no fue encontrado\n'
                        throw 0
                    }
                }
                await session.commitTransaction()
                session.endSession();
                return {
                    estado: true,
                    message: 'Planilla registrado correctamente'
                }
            }catch(error){
                await session.abortTransaction()
                session.endSession();
                console.log(error)
                return {
                    estado: false,
                    message: message_error
                };
            }
            */
        }
    }
}