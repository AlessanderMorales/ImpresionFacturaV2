import { ItemVenta } from './ItemVenta.js';

export class Venta {
    constructor() {
        this.items = [];
    }

    agregar_item(item) {
        Venta.validarItemParaAgregar(item);
        this.items.push(item);
    }

    static validarItemParaAgregar(item) {
        if (!(item instanceof ItemVenta)) {
            throw new Error("El objeto a agregar no es una instancia válida de ItemVenta.");
        }
    }

    calcular_total() {
        return this.items.reduce((total, item) => total + item.calcular_subtotal(), 0);
    }
}