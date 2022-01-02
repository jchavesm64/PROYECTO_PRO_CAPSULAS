import { Productos } from '../models'
import { MovimientosProducto } from '../models';

export default {
    Query: {
        obtenerProductos: async (_, { }) => {
            try {
                const productos = await Productos.find({ estado: 'ACTIVO' }).populate({path: 'orden_produccion', populate: [{path: 'formula', path: 'cliente'}]});
                return productos.sort(function(a, b){
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
        },
        obtenerProductosConMovimientos: async (_, { }) => {
            try {
                var productosmovimientos = []
                const productos = await Productos.find({ estado: 'ACTIVO' }).populate({path: 'orden_produccion', populate: [{path: 'formula', path: 'cliente'}]});;
                productos.map(item => {
                    const result = MovimientosProducto.find({producto: item.id}).populate('usuario')
                    productosmovimientos.push({
                        producto: item,
                        movimientos: result
                    })
                })
                return productosmovimientos.sort(function(a, b){
                    if(a.producto_.nombre > b.producto_.nombre){
                        return 1
                    }
                    if(a.producto_.nombre < b.producto_.nombre){
                        return -1
                    }
                    return 0;
                });
            } catch (error) {
                return error;
            }
        },
        obtenerProducto: async (_, { id }) => {
            try {
                const producto = await Productos.findById(id);
                return producto;
            } catch (error) {

            }
        }
    },
    Mutation: {
        insertarProducto: async (_, { input }) => {
            try {
                const producto = new Productos(input);
                const result = await producto.save();
                return {
                    estado: true,
                    data: result,
                    message: "La producto fue registrado con éxito"
                };
            } catch (error) {
                console.log(error)
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al registrar el producto"
                };
            }
        },
        actualizarProducto: async (_, { id, input }) => {
            try {
                const producto = await Productos.findOneAndUpdate({ _id: id }, input, { new: true });
                return {
                    estado: true,
                    data: producto,
                    message: "La producto fue actualizado con éxito"
                };
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al registrar el producto "
                };
            }
        },
        desactivarProducto: async (_, { id }) => {
            try {
                const producto = await Productos.findOneAndUpdate({ _id: id }, { estado: "INACTIVO" }, { new: true });
                if (Productos) {
                    return {
                        estado: true,
                        data: null,
                        message: "Producto  eliminado correctamente"
                    };
                } else {
                    return {
                        estado: false,
                        data: null,
                        message: "No se pudo eliminar el producto "
                    };
                }
            } catch (error) {
                return {
                    estado: false,
                    data: null,
                    message: "Ocurrio un error al eliminar el producto "
                };
            }
        }
    }
}