export class Cliente {
    constructor(id, nombreYApellido, nit) {
        if (!id || typeof id !== 'string') throw new Error("ID de cliente inválido.");
        if (!nombreYApellido || typeof nombreYApellido !== 'string') throw new Error("Nombre y Apellido de cliente inválido.");
        if (typeof nit !== 'number' || nit < 0) throw new Error("NIT de cliente inválido.");

        this.id = id;
        this.nombreYApellido = nombreYApellido;
        this.nit = nit;
    }
}
