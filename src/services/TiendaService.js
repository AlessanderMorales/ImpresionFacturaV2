import { datosTiendas } from '../data/tiendas.js';
import { Tienda } from '../models/Tienda.js';

export class TiendaService {
    static obtenerTiendaPorNombre(nombre) {
        const tiendaData = datosTiendas.find(t => t.nombre_tienda === nombre);
        return tiendaData ? new Tienda(tiendaData.nombre_tienda, tiendaData.ubicacion, tiendaData.telefono, tiendaData.codigo_autorizacion, tiendaData.nit) : undefined;
    }
}