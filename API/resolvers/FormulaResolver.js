import { Formulas } from "../models";

export default{
    Query:{
        obtenerFormulas: async (_, {}) => {
            try{
                const formulas = await Formulas.find({estado: 'ACTIVO'}).populate({ path: 'elementos', populate: [{ path: 'proveedor' }] });
                return formulas
            }catch(error){
                return error
            }
        },
        obtenerFormula: async (_, {id}) => {
            try{
                const formula = await Formulas.findById(id).populate({ path: 'elementos', populate: [{ path: 'proveedor' }] });
                return formula
            }catch(error){
                return error
            }
        }
    },
    Mutation: {
        insertarFormula: async (_, {input}) => {
            try{
                const formula = new Formulas(input);
                    const result = await formula.save();
                    return {
                        estado: true,
                        data: result,
                        message: "La formula fue registrado con éxito"
                    };
            }catch(error){
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al registrar la formula"
                };
            }
        },
        actualizarFormula: async (_, {id, input}) => {
            try{
                const formula = await Formulas.findOneAndUpdate({_id: id}, input, {new: true});
                return {
                    estado: true,
                    data: formula,
                    message: "la formula fue actualizado con éxito"
                };
            }catch(error){
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al actualizar la formula"
                };
            }
        },
        desactivarFormula: async (_, {id}) => {
            try{
                const formula = await Formulas.findOneAndUpdate({_id: id}, {estado: "INACTIVO"}, {new: true});
                if(formula){
                    return {
                        estado: true,
                        data: null,
                        message: "Formula eliminada correctamente"
                    };
                }else{
                    return {
                        estado: false,
                        data: null,
                        message: "No se pudo eliminar la formula"
                    };
                }
            }catch(error){
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al eliminar la formula"
                };
            }
        }
    }
}