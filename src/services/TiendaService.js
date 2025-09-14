import { datosTiendas } from '../data/tiendas.js';
import { Tienda } from '../models/Tienda.js';

const TIENDA_STORAGE_KEY = 'tienda_principal';

// Función para inicializar la tienda en localStorage si no existe
function inicializarTienda() {
    let tienda = JSON.parse(localStorage.getItem(TIENDA_STORAGE_KEY));
    if (!tienda) {
        localStorage.setItem(TIENDA_STORAGE_KEY, JSON.stringify(datosTiendas[0])); // Usamos la primera del array como principal
    }
}

inicializarTienda(); // Llama a la inicialización al cargar el script

export class TiendaService {
    static obtenerTiendaPorNombre(nombre) { // Aunque recibimos un nombre, siempre trabajaremos con la única tienda principal
        const tiendaData = JSON.parse(localStorage.getItem(TIENDA_STORAGE_KEY));
        // Se podría añadir una validación para el nombre si se gestionaran múltiples tiendas
        return tiendaData ? new Tienda(tiendaData.nombre_tienda, tiendaData.ubicacion, tiendaData.telefono, tiendaData.codigo_autorizacion, tiendaData.nit) : undefined;
    }

    // Nuevo: Guardar/Actualizar la tienda
    static guardarTienda(tienda) {
        localStorage.setItem(TIENDA_STORAGE_KEY, JSON.stringify(tienda));
    }
}