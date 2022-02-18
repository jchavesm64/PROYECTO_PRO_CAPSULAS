import {PuestoLimpieza} from '../models';

export default{
    Query:{
        obtenerPuestoLimpiezas: async (_, {}) => {
            try{
                const puestos = await PuestoLimpieza.find({estado: "ACTIVO"}).populate('ubicacion');
                return puestos.sort(function(a, b){
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
        obtenerPuestoLimpieza: async (_, {id}) => {
            try{
                const puesto = await PuestoLimpieza.findById(id).populate('ubicacion');
                return puesto;
            }catch(error){
                return error;
            }
        }
    },
    Mutation:{
        insertarPuestoLimpieza: async (_, {input}) => {
            try{
                const { codigo } = input;
                const existe = await PuestoLimpieza.findOne({codigo});
                if(existe){
                    return {
                        estado: false,
                        data: null,
                        message: "El puesto de limpieza ya existe"
                    };
                }else{
                    const puesto = new PuestoLimpieza(input);
                    const result = await puesto.save();
                    return {
                        estado: true,
                        data: result,
                        message: "El puesto de limpieza fue registrado con éxito"
                    };
                }
            }catch(error){
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al registrar el puesto de limpieza"
                };
            }
        },
        actualizarPuestoLimpieza: async (_, {id, input}) => {
            try{
                const puesto = await PuestoLimpieza.findOneAndUpdate({_id: id}, input, {new: true});
                return {
                    estado: true,
                    data: puesto,
                    message: "El puesto de limpieza fue actualizado con éxito"
                };
            }catch(error){
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al registrar el puesto de limpieza"
                };
            }
        },
        desactivarPuestoLimpieza: async (_, {id}) => {
            try{
                const puesto = await PuestoLimpieza.findOneAndUpdate({_id: id}, {estado: "INACTIVO"}, {new: true});
                if(puesto){
                    return {
                        estado: true,
                        data: null,
                        message: "El puesto de limpieza eliminado correctamente"
                    };
                }else{
                    return {
                        estado: false,
                        data: null,
                        message: "No se pudo eliminar el puesto de limpieza"
                    };
                }
            }catch(error){
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al eliminar el puesto"
                };
            }
        }
    }
}