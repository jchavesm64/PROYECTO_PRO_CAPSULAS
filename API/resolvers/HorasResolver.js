import { Horas, Personal } from "../models";
const mongoose = require('mongoose');

export default{
    Query: {
        obtenerHoras: async (_, {f1, f2}) => {
            try{
                const horas = await Horas.find({fecha: {$gte: f1, $lte: f2}}).populate({path: 'empleado', populate: [{path: 'puesto'}]});
                return horas
            }catch(error){
                return error;
            }
        }
    },
    Mutation: {
        saveHoras: async (_, {input}) => {
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
                        let new_hora = new Horas(horas)
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
                    message: 'Horas registrado correctamente'
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
        }
    }
}