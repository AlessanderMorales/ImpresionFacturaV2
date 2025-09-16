export class Producto {
    constructor(id, nombre, precio) {
        Producto.validarId(id);
        Producto.validarNombre(nombre);
        Producto.validarPrecio(precio);

        this.id = id;
        this.nombre = nombre.trim();
        this.precio = precio;
    }

    static validarId(id) {
        if (typeof id !== 'number' || !Number.isInteger(id) || id <= 0) {
            throw new Error("ID de producto inválido. Debe ser un número entero positivo.");
        }
    }

    static validarNombre(nombre) {
        if (typeof nombre !== 'string' || nombre.trim() === '') {
            throw new Error("Nombre de producto inválido. Debe ser una cadena de texto no vacía.");
        }
        if (/^\d+$/.test(nombre.trim())) {
            throw new Error("Nombre de producto no puede consistir únicamente en números.");
        }
    }

    static validarPrecio(precio) {
        if (typeof precio !== 'number' || precio <= 0) {
            throw new Error("Precio de producto inválido. Debe ser un número positivo.");
        }
    }
}