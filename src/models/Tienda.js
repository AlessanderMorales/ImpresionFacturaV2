
export class Tienda {
    constructor(nombre_tienda, ubicacion, telefono, codigo_autorizacion, nit) {
        if (!nombre_tienda || typeof nombre_tienda !== 'string') throw new Error("Nombre de tienda inválido.");
        if (!ubicacion || typeof ubicacion !== 'string') throw new Error("Ubicación de tienda inválida.");
        if (typeof telefono !== 'number' || telefono <= 0) throw new Error("Teléfono de tienda inválido.");
        if (typeof codigo_autorizacion !== 'number' || codigo_autorizacion <= 0) throw new Error("Código de autorización inválido.");
        if (typeof nit !== 'number' || nit <= 0) throw new Error("NIT de tienda inválido.");

        this.nombre_tienda = nombre_tienda;
        this.ubicacion = ubicacion;
        this.telefono = telefono;
        this.codigo_autorizacion = codigo_autorizacion;
        this.nit = nit;
    }
}