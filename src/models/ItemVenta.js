import { Producto } from './Producto.js';
export class ItemVenta {
    constructor(cantidad, producto) {
        if (typeof cantidad !== 'number' || cantidad <= 0) throw new Error("Cantidad inválida para ItemVenta.");
        if (!(producto instanceof Producto)) throw new Error("Producto inválido para ItemVenta.");

        this.cantidad = cantidad;
        this.producto = producto;
        this.subtotal = this.calcularSubtotal();
    }
    calcularSubtotal() {
        return this.cantidad * this.producto.precio;
    }
}