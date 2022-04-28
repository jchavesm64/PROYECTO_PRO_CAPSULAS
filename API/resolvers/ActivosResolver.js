import {Activos} from '../models';

export default{
    Query:{
        obtenerActivos: async (_, {}) => {
            try{
                const activos = await Activos.find({state: 'ACTIVO'});
                return activos.sort(function(a, b){
                    if(a.numero > b.numero){
                        return 1
                    }
                    if(a.numero < b.numero){
                        return -1
                    }
                    return 0;
                });
            }catch(error){
                return error;
            }
        },
        obtenerActivo: async (_, {id}) => {
            try{
                const activo = await Activos.findById(id);
                return activo;
            }catch(error){
                return error;
            }
        }
    },
    Mutation:{
        insertarActivo: async (_, {input}) => {
            try{
                const { numero } = input;
                const existe = await Activos.findOne({numero});
                if(existe){
                    return {
                        estado: false,
                        data: null,
                        message: "El activo ya existe"
                    };
                }else{
                    const activo = new Activos(input);
                    const result = await activo.save();
                    return {
                        estado: true,
                        data: result,
                        message: "El activo fue registrado con éxito"
                    };
                }
            }catch(error){
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al registrar el activo"
                };
            }
        },
        actualizarActivo: async (_, {id, input}) => {
            try{
                const activo = await Activos.findOneAndUpdate({_id: id}, input, {new: true});
                return {
                    estado: true,
                    data: activo,
                    message: "El activo fue actualizado con éxito"
                };
            }catch(error){
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al registrar el activo"
                };
            }
        },
        desactivarActivo: async (_, {id}) => {
            try{
                const activo = await Activos.findOneAndUpdate({_id: id}, {state: "INACTIVO"}, {new: true});
                if(activo){
                    return {
                        estado: true,
                        data: null,
                        message: "Activos eliminado correctamente"
                    };
                }else{
                    return {
                        estado: false,
                        data: null,
                        message: "No se pudo eliminar el activo"
                    };
                }
            }catch(error){
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al eliminar el activo"
                };
            }
        }
    }
}