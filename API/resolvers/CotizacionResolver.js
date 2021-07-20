import { Cotizacion, Movimientos } from "../models";
const mongoose = require('mongoose');

export default{
    Query:{
        obtenerCotizaciones: async (_, {}) => {
            try{
                const result = await Cotizacion.find().populate('formula').populate('elementos');
                return result;
            }catch(error){
                return error
            }
        },
        obtenerCotizacion: async (_, {id}) => {
            try{
                const result = await Cotizacion.findById(id).populate('formula').populate('elementos');
                return result;
            }catch(error){
                return error
            }
        }
    },
    Mutation:{
        insertarCotizacion: async (_, {input}) => {
            const session = await mongoose.startSession()
            session.startTransaction()
            try{
                console.log("Hola 1")
                var date = new Date();
                var fecha = date.getFullYear() + "-" + (((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-' + ((date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate());
                const opts = {session, new:true}
                const {objeto, materias, usuario} = input
                //Guardar cotizacion
                const cotizacion = new Cotizacion(objeto);
                await cotizacion.save()
                //Actualizar Lotes
                var reducir = 0
                for(let i = 0; i < materias.length; i++){
                    reducir = materias[i].total;
                    const movimientos = await Movimientos.find({materia_prima: materias[i].id, tipo: 'ENTRADA'});
                    for(let j = 0; j < movimientos.length; j++){
                        if(movimientos[j].existencia > 0){
                            if(movimientos[j].existencia < reducir){
                                reducir -= movimientos[j].existencia
                                const salida = {
                                    tipo: 'SALIDA',
                                    lote: movimientos[j].lote,
                                    codigo: movimientos[j].codigo,
                                    fecha: fecha,
                                    cantidad: movimientos[j].existencia,
                                    unidad: movimientos[j].unidad,
                                    usuario: usuario,
                                    materia_prima: materias[i].id
                                }
                                await Movimientos.findOneAndUpdate({_id: movimientos[j].id}, {existencia: 0}, {new: true})
                                const saveSalida = new Movimientos(salida);
                                await saveSalida.save()
                            }else{
                                const salida = {
                                    tipo: 'SALIDA',
                                    lote: movimientos[j].lote,
                                    codigo: movimientos[j].codigo,
                                    fecha: fecha,
                                    cantidad: reducir,
                                    unidad: movimientos[j].unidad,
                                    usuario: usuario,
                                    materia_prima: materias[i].id
                                }
                                var newExistencia = movimientos[j].existencia - reducir
                                await Movimientos.findOneAndUpdate({_id: movimientos[j].id}, {existencia: newExistencia}, {new: true})
                                const saveSalida = new Movimientos(salida);
                                await saveSalida.save()
                            }
                        }
                    }
                }
                await session.commitTransaction()
                session.endSession();
                return{
                    estado: true,
                    message: "Cotizacíon generada con éxito"
                }
            }catch(error){
                console.log('hola')
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