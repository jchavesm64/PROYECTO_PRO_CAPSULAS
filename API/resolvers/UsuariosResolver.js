import { Usuario } from "../models"


export default {
    Query:{
        obtenerUsuariosActivos: async (_, {}) => {
            try{
                const usuarios = await Usuario.find({estado: "ACTIVO"}).populate('rol');
                return usuarios;
            }catch(error){
                return error;
            }
        }
    }
}