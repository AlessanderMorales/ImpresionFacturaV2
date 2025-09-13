import { datosProductos } from '../data/productos.js';
import { Producto } from '../models/Producto.js';

export class ProductoService {
    static obtenerTodosLosProductos() {
        return datosProductos.map(p => new Producto(p.id, p.nombre, p.precio));
    }

    static obtenerProductoPorId(id) {
        const productoData = datosProductos.find(p => p.id === id);
        return productoData ? new Producto(productoData.id, productoData.nombre, productoData.precio) : undefined;
    }
}