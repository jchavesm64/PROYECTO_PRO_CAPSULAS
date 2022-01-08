import { Categoria } from '../models';

export default {
    Query: {
        obtenerCategorias: async (_, { }) => {
            try {
                const categorias = await Categoria.find({ estado: "ACTIVO" });
                return categorias.sort(function(a, b){
                    if(a.nombre > b.nombre){
                        return 1
                    }
                    if(a.nombre < b.nombre){
                        return -1
                    }
                    return 0;
                });
            } catch (error) {
                return error;
            }
        }
    },
    Mutation: {
        insertarCategoria: async (_, { input }) => {
            try {
                const { nombre } = input;
                const existe = await Categoria.findOne({ nombre });
                if (existe) {
                    return {
                        estado: false,
                        data: null,
                        message: "El categoria ya existe"
                    }
                } else {
                    const categoria = new Categoria(input);
                    const result = await categoria.save();
                    return {
                        estado: true,
                        data: result,
                        message: "Categoria agregada correctamente"
                    }
                }
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error inesperado al registrar el categoria"
                }
            }
        },
        actualizarCategoria: async (_, { id, input }) => {
            try {
                const categoria = await Categoria.findOneAndUpdate({ _id: id }, input, { new: true });
                return {
                    estado: true,
                    data: categoria,
                    message: "Categoria, actualizada correctamente"
                }
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error inesperado al actualizar el categoria"
                }
            }
        },
        desactivarCategoria: async (_, { id }) => {
            try {
                const categoria = await Categoria.findOneAndUpdate({ _id: id }, { estado: 'INACTIVO' }, { new: true });
                if (categoria) {
                    return {
                        estado: true,
                        data: null,
                        message: "Categoria eliminada correctamente"
                    };
                } else {
                    return {
                        estado: false,
                        data: null,
                        message: "No se pudo eliminar el categoria"
                    }
                }
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio en error inesperado al eliminar el categoria"
                }
            }
        }
    }
}