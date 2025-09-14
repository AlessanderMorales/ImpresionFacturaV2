import { datosProductos } from '../data/productos.js';
import { Producto } from '../models/Producto.js';

const PRODUCTOS_STORAGE_KEY = 'productos_tienda';

// Función para inicializar productos en localStorage si no existen
function inicializarProductos() {
    let productos = JSON.parse(localStorage.getItem(PRODUCTOS_STORAGE_KEY));
    if (!productos || productos.length === 0) {
        localStorage.setItem(PRODUCTOS_STORAGE_KEY, JSON.stringify(datosProductos));
    }
}

inicializarProductos(); // Llama a la inicialización al cargar el script

export class ProductoService {
    static obtenerTodosLosProductos() {
        const productosData = JSON.parse(localStorage.getItem(PRODUCTOS_STORAGE_KEY)) || [];
        return productosData.map(p => new Producto(p.id, p.nombre, p.precio));
    }

    static obtenerProductoPorId(id) {
        const productosData = JSON.parse(localStorage.getItem(PRODUCTOS_STORAGE_KEY)) || [];
        const productoData = productosData.find(p => p.id === id);
        return productoData ? new Producto(productoData.id, productoData.nombre, productoData.precio) : undefined;
    }

    // Nuevo: Agregar un producto
    static agregarProducto(producto) {
        const productos = ProductoService.obtenerTodosLosProductos();
        if (productos.find(p => p.id === producto.id)) {
            throw new Error(`Ya existe un producto con el ID ${producto.id}`);
        }
        productos.push(producto);
        localStorage.setItem(PRODUCTOS_STORAGE_KEY, JSON.stringify(productos));
    }

    // Nuevo: Actualizar un producto existente
    static actualizarProducto(productoActualizado) {
        let productos = ProductoService.obtenerTodosLosProductos();
        const index = productos.findIndex(p => p.id === productoActualizado.id);
        if (index === -1) {
            throw new Error(`Producto con ID ${productoActualizado.id} no encontrado para actualizar.`);
        }
        productos[index] = productoActualizado;
        localStorage.setItem(PRODUCTOS_STORAGE_KEY, JSON.stringify(productos));
    }

    // Nuevo: Eliminar un producto
    static eliminarProducto(id) {
        let productos = ProductoService.obtenerTodosLosProductos();
        const productosFiltrados = productos.filter(p => p.id !== id);
        if (productosFiltrados.length === productos.length) {
            throw new Error(`Producto con ID ${id} no encontrado para eliminar.`);
        }
        localStorage.setItem(PRODUCTOS_STORAGE_KEY, JSON.stringify(productosFiltrados));
    }

    // Nuevo: Generar un nuevo ID único para productos
    static generarNuevoIdProducto() {
        const productos = ProductoService.obtenerTodosLosProductos();
        if (productos.length === 0) {
            return 101; // Primer ID si no hay productos
        }
        const maxId = Math.max(...productos.map(p => p.id));
        return maxId + 1;
    }
}