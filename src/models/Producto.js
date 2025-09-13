export class Producto {
    constructor(id, nombre, precio) {
        if (typeof id !== 'number' || id <= 0) throw new Error("ID de producto inválido.");
        if (!nombre || typeof nombre !== 'string') throw new Error("Nombre de producto inválido.");
        if (typeof precio !== 'number' || precio <= 0) throw new Error("Precio de producto inválido.");

        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
    }
}