import Cliente from '../models';

export default{
    Query:{
        obtenerClientes: async (_, {}) => {
            try{
                const clientes = await Cliente.find({estado: "ACTIVO"});
                return clientes;
            }catch(error){
                return error;
            }
        }
    },
    Mutation:{
        insertarCliente: async (_, {input}) => {
            try{
                const { codigo } = input;
                const existe = await Cliente.findOne({codigo});
                if(existe){
                    return "El cliente ya existe";
                }else{
                    const cliente = new Cliente(input);
                    const result = cliente.save();
                    return result;
                }
            }catch(error){
                return error;
            }
        },
        actualizarCliente: async (_, {id, input}) => {
            try{
                const cliente = await Cliente.findOneAndUpdate({_id: id}, input, {new: true});
                return cliente;
            }catch(error){
                return error;
            }
        },
        desactivarCliente: async (_, {id}) => {
            try{
                const cliente = await Cliente.findOneAndUpdate({_id: id}, {estado: "INACTIVO"}, {new: true});
                if(cliente){
                    return "Cliente eliminado correctamente";
                }else{
                    return "No se pudo eliminar el cliente";
                }
            }catch(error){
                return error;
            }
        }
    }
}