import {Personal} from '../models';

export default{
    Query:{
        obtenerPersonal: async (_, {}) => {
            try{
                const personal = await Personal.find({estado: "ACTIVO"}).populate('puesto');
                return personal.sort(function(a, b){
                    if(a.nombre > b.nombre){
                        return 1
                    }
                    if(a.nombre < b.nombre){
                        return -1
                    }
                    return 0;
                });
            }catch(error){
                return error;
            }
        },
        obtenerPersonalOne: async (_, {id}) => {
            try{
                const personal = await Personal.findById(id).populate('puesto');
                return personal;
            }catch(error){
                return error;
            }
        }
    },
    Mutation:{
        insertarPersonal: async (_, {input}) => {
            try{
                const { cedula } = input;
                const existe = await Personal.findOne({cedula});
                if(existe){
                    return {
                        estado: false,
                        data: null,
                        message: "El colaborador ya existe"
                    };
                }else{
                    const personal = new Personal(input);
                    const result = await personal.save();
                    return {
                        estado: true,
                        data: result,
                        message: "El colaborador fue registrado con éxito"
                    };
                }
            }catch(error){
                console.log(error)
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al registrar el colaborador"
                };
            }
        },
        actualizarPersonal: async (_, {id, input}) => {
            try{
                const personal = await Personal.findOneAndUpdate({_id: id}, input, {new: true});
                return {
                    estado: true,
                    data: personal,
                    message: "El colaborador fue actualizado con éxito"
                };
            }catch(error){
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al registrar el colaborador"
                };
            }
        },
        desactivarPersonal: async (_, {id}) => {
            try{
                const personal = await Personal.findOneAndUpdate({_id: id}, {estado: "INACTIVO"}, {new: true});
                if(personal){
                    return {
                        estado: true,
                        data: null,
                        message: "Colaborador eliminado correctamente"
                    };
                }else{
                    return {
                        estado: false,
                        data: null,
                        message: "No se pudo eliminar el colaborador"
                    };
                }
            }catch(error){
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al eliminar el colaborador"
                };
            }
        }
    }
}