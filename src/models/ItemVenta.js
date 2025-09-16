import { Producto } from './Producto.js';

export class ItemVenta {
    constructor(cantidad, producto) {
        ItemVenta.validarCantidad(cantidad);
        ItemVenta.validarProducto(producto);

        this.cantidad = cantidad;
        this.producto = producto;
        this.subtotal = this.calcular_subtotal();
    }

    static validarCantidad(cantidad) {
        if (typeof cantidad !== 'number' || !Number.isInteger(cantidad) || cantidad <= 0) {
            throw new Error("Cantidad inválida para el item de venta. Debe ser un número entero positivo.");
        }
    }

    static validarProducto(producto) {
        if (!(producto instanceof Producto)) {
            throw new Error("Producto inválido para el item de venta. Debe ser una instancia de la clase Producto.");
        }
    }

    calcular_subtotal() {
        return this.cantidad * this.producto.precio;
    }
}