import { Venta } from "./Venta.js";
import { Pago } from "./Pago.js";
import { Tienda } from "./Tienda.js";
import { Cliente } from "./Cliente.js";

export class Factura {
  constructor(numero_factura, fecha, venta, pago, tienda, cliente) {
    if (typeof numero_factura !== 'number' || numero_factura <= 0) throw new Error("Número de factura inválido.");
    if (!(fecha instanceof Date)) throw new Error("Fecha de factura inválida.");
    if (!(venta instanceof Venta)) throw new Error("Venta inválida.");
    if (!(pago instanceof Pago)) throw new Error("Pago inválido. Debe ser una instancia de Pago o sus subclases.");
    if (!(tienda instanceof Tienda)) throw new Error("Tienda inválida.");
    if (!(cliente instanceof Cliente)) throw new Error("Cliente inválido.");

    this.numero_factura = numero_factura;
    this.fecha = fecha;
    this.venta = venta;
    this.pago = pago;
    this.tienda = tienda;
    this.cliente = cliente;
    this.total = venta.calcularTotal();
    this.facturaOnline = this.generarFacturaOnline();
  }
  generarFacturaOnline() {
    return `FacturaOnline-QR-${this.numero_factura}-${Date.now()}`;
  }
  obtenerDetalles() {
    return {
        numero_factura: this.numero_factura,
        fecha: this.fecha.toISOString(),
        total: this.total,
        pagoRealizado: this.pago.realizarPago(),
        tipoDePago: this.pago.constructor.name,
        tienda: this.tienda,
        cliente: this.cliente,
        ventaDetalles: this.venta.items.map(item => ({
            producto: item.producto.nombre,
            cantidad: item.cantidad,
            precioUnitario: item.producto.precio,
            subtotal: item.subtotal
        })),
        facturaOnline: this.facturaOnline
    };
  }
}