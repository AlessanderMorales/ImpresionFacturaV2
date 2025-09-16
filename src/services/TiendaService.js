import { datosTiendas } from '../data/tiendas.js';
import { Tienda } from '../models/Tienda.js';

const TIENDA_STORAGE_KEY = 'tienda_principal';

function inicializarTienda() {
    let tienda = JSON.parse(localStorage.getItem(TIENDA_STORAGE_KEY));
    if (!tienda) {
        localStorage.setItem(TIENDA_STORAGE_KEY, JSON.stringify(datosTiendas[0]));
    }
}

inicializarTienda();

export class TiendaService {
    static obtenerTiendaPorNombre(nombre) {
        const tiendaData = JSON.parse(localStorage.getItem(TIENDA_STORAGE_KEY));
        return tiendaData ? new Tienda(tiendaData.nombre_tienda, tiendaData.ubicacion, tiendaData.telefono, tiendaData.codigo_autorizacion, tiendaData.nit) : undefined;
    }

    static guardarTienda(tienda) {
        localStorage.setItem(TIENDA_STORAGE_KEY, JSON.stringify(tienda));
    }
}