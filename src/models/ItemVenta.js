import Producto from "./Producto.js";

export default class ItemVenta {
  constructor(producto, cantidad) {
    if (!(producto instanceof Producto)) {
      throw new Error("El item debe contener un Producto válido.");
    }
    this.producto = producto;
    this.cantidad = cantidad;
    this.subtotal = this.calcularSubtotal();
  }

  calcularSubtotal() {
    return this.producto.precio * this.cantidad;
  }
}