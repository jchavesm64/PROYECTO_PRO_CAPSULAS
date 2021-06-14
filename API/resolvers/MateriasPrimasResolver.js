import { MateriasPrimas } from '../models'

export default {
    Query: {
        obtenerMateriasPrimas: async (_, { }) => {
            try{
                const materias = await MateriasPrimas.find({estado: 'ACTIVO'}).populate('proveedor');
                return materias
            }catch(error){
                return error;
            }
        },
        obtenerMateriaPrima: async (_, {id}) => {
            try{
                const materia = await MateriasPrimas.findById(id).populate('proveedor');
                return materia;
            }catch(error){

            }
        }
    },
    Mutation:{
        insertarMateriaPrima: async (_, {input}) => {
            try{
                const { codigo } = input;
                const existe = await MateriasPrimas.findOne({codigo});
                if(existe){
                    return {
                        estado: false,
                        data: null,
                        message: "La materia prima ya existe"
                    };
                }else{
                    const materia = new MateriasPrimas(input);
                    const result = await materia.save();
                    return {
                        estado: true,
                        data: result,
                        message: "La materia prima fue registrada con éxito"
                    };
                }
            }catch(error){
                console.log(error)
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al registrar el MateriasPrimas"
                };
            }
        },
        actualizarMateriaPrima: async (_, {id, input}) => {
            try{
                const materia = await MateriasPrimas.findOneAndUpdate({_id: id}, input, {new: true});
                return {
                    estado: true,
                    data: materia,
                    message: "La materia prima fue actualizada con éxito"
                };
            }catch(error){
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al registrar la materia prima"
                };
            }
        },
        desactivarMateriaPrima: async (_, {id}) => {
            try{
                const materia = await MateriasPrimas.findOneAndUpdate({_id: id}, {estado: "INACTIVO"}, {new: true});
                if(MateriasPrimas){
                    return {
                        estado: true,
                        data: null,
                        message: "Materia prima eliminada correctamente"
                    };
                }else{
                    return {
                        estado: false,
                        data: null,
                        message: "No se pudo eliminar la materia prima"
                    };
                }
            }catch(error){
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al eliminar la materia prima"
                };
            }
        }
    }
}