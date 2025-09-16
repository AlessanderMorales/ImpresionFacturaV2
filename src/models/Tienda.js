export class Tienda {
    constructor(nombre_tienda, ubicacion, telefono, codigo_autorizacion, nit) {
        Tienda.validarNombreTienda(nombre_tienda);
        Tienda.validarUbicacion(ubicacion);
        Tienda.validarTelefono(telefono);
        Tienda.validarCodigoAutorizacion(codigo_autorizacion);
        Tienda.validarNit(nit);

        this.nombre_tienda = nombre_tienda.trim();
        this.ubicacion = ubicacion.trim();
        this.telefono = telefono;
        this.codigo_autorizacion = codigo_autorizacion;
        this.nit = nit;
    }

    static validarNombreTienda(nombre_tienda) {
        if (typeof nombre_tienda !== 'string' || nombre_tienda.trim() === '') {
            throw new Error("Nombre de tienda inválido. Debe ser una cadena de texto no vacía.");
        }
        if (/^\d+$/.test(nombre_tienda.trim())) {
            throw new Error("Nombre de tienda no puede consistir únicamente en números.");
        }
    }

    static validarUbicacion(ubicacion) {
        if (typeof ubicacion !== 'string' || ubicacion.trim() === '') {
            throw new Error("Ubicación de tienda inválida. Debe ser una cadena de texto no vacía.");
        }
    }

    static validarTelefono(telefono) {
        if (typeof telefono !== 'number' || !Number.isInteger(telefono) || telefono <= 0) {
            throw new Error("Teléfono de tienda inválido. Debe ser un número entero positivo.");
        }
        
    }

    static validarCodigoAutorizacion(codigo_autorizacion) {
        if (typeof codigo_autorizacion !== 'number' || !Number.isInteger(codigo_autorizacion) || codigo_autorizacion <= 0) {
            throw new Error("Código de autorización inválido. Debe ser un número entero positivo.");
        }
    }

    static validarNit(nit) {
        if (typeof nit !== 'number' || !Number.isInteger(nit) || nit <= 0) {
            throw new Error("NIT de tienda inválido. Debe ser un número entero positivo.");
        }
    }
}