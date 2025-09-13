import { datosProductos } from '../data/productos.js';
import { Producto } from '../models/Producto.js';


export class ProductoService {
    static obtenerProductoPorId(id) {
        const productoData = datosProductos.find(p => p.id === id);
        return productoData ? new Producto(productoData.id, productoData.nombre, productoData.precio) : undefined;
    }
}