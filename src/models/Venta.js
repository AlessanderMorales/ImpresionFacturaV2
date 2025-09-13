import { ItemVenta } from './ItemVenta.js';
export class Venta {
    constructor() {
        this.items = [];
    }
    agregarItem(item) {
        if (!(item instanceof ItemVenta)) throw new Error("El objeto no es una instancia de ItemVenta.");
        this.items.push(item);
    }
    calcularTotal() {
        return this.items.reduce((total, item) => total + item.calcularSubtotal(), 0);
    }
}