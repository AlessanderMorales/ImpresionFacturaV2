export class Cliente {
    constructor(id, nombreYApellido, nit) {
        Cliente.validarId(id);
        Cliente.validarNombreYApellido(nombreYApellido);
        Cliente.validarNit(nit);
        
        this.id = id.trim();
        this.nombreYApellido = nombreYApellido.trim();
        this.nit = nit;
    }

    static validarId(id) {
        if (typeof id !== 'string' || id.trim() === '') {
            throw new Error("ID de cliente inválido. Debe ser una cadena de texto no vacía.");
        }
    }

    static validarNombreYApellido(nombreYApellido) {
        if (typeof nombreYApellido !== 'string' || nombreYApellido.trim() === '') {
            throw new Error("Nombre y Apellido de cliente inválido. Debe ser una cadena de texto no vacía.");
        }
        if (/^\d+$/.test(nombreYApellido.trim())) {
            throw new Error("Nombre y Apellido no puede consistir únicamente en números.");
        }
    }

    static validarNit(nit) {
        if (typeof nit !== 'number' || !Number.isInteger(nit) || nit <= 0) {
            throw new Error("NIT de cliente inválido. Debe ser un número entero positivo.");
        }
    }
}