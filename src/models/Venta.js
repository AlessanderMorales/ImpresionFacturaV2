import ItemVenta from "./ItemVenta.js";

export default class Venta {
  constructor() {
    this.items = [];
  }

  agregarItem(item) {
    if (!(item instanceof ItemVenta)) {
      throw new Error("Debe agregar un ItemVenta válido.");
    }
    this.items.push(item);
  }

  calcularTotal() {
    return this.items.reduce((total, item) => total + item.calcularSubtotal(), 0);
  }
}