import { Cotizacion, Movimientos } from "../models";
const mongoose = require('mongoose');

export default{
    Mutation:{
        insertarCotizacion: async (_, {input}) => {
            const session = await mongoose.startSession()
            session.startTransaction()
            try{
                const opts = {session, new:true}
                const {objeto, lotes, salidas} = input
                //Guardar cotizacion
                const cotizacion = new Cotizacion(objeto);
                await cotizacion.save()
                //Actualizar Lotes
                for(let i = 0; i < lotes.length; i++){
                    var item = lotes[i]
                    const mov = await Movimientos.findById({_id: item.id});
                    var newExistencia = mov.existencia - item.existencia;
                    await Movimientos.findOneAndUpdate({_id: item.id}, {existencia: newExistencia}, {new: true})
                }
                //Registrar Salidas
                for(let i = 0; i < salidas.length; i++){
                    var item = salidas[i]
                    const salida = new Movimientos(item)
                    await salida.save()
                }
                await session.commitTransaction()
                session.endSession();
                return{
                    estado: true,
                    message: "Cotizacíon generada con éxito"
                }
            }catch(error){
                console.log(error)
                await session.abortTransaction()
                session.endSession();
                return{
                    estado: false,
                    message: "Ocurrio un error al generar la cotizacíon"
                }
            }
        }
    }
}