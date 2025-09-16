import { Venta } from "./Venta.js";
import { Pago } from "./Pago.js"; // Importa la clase base Pago
import { Tienda } from "./Tienda.js";
import { Cliente } from "./Cliente.js";

export class Factura {
    constructor(numero_factura, fecha, venta, pago, tienda, cliente) {
        Factura.validarNumeroFactura(numero_factura);
        Factura.validarFecha(fecha);
        Factura.validarVenta(venta);
        Factura.validarPago(pago);
        Factura.validarTienda(tienda);
        Factura.validarCliente(cliente);

        this.numero_factura = numero_factura;
        this.fecha = fecha;
        this.venta = venta;
        this.pago = pago;
        this.tienda = tienda;
        this.cliente = cliente;
        this.total = venta.calcularTotal(); // Asume que venta.calcularTotal() funciona correctamente
        this.facturaOnline = this.generarFacturaOnline();
    }

    static validarNumeroFactura(numero_factura) {
        if (typeof numero_factura !== 'number' || !Number.isInteger(numero_factura) || numero_factura <= 0) {
            throw new Error("Número de factura inválido. Debe ser un número entero positivo.");
        }
    }

    static validarFecha(fecha) {
        if (!(fecha instanceof Date) || isNaN(fecha.getTime())) {
            throw new Error("Fecha de factura inválida. Debe ser una instancia válida de Date.");
        }
    }

    static validarVenta(venta) {
        if (!(venta instanceof Venta)) {
            throw new Error("Venta inválida. Debe ser una instancia de la clase Venta.");
        }
    }

    static validarPago(pago) {
        // Usa `instanceof Pago` para permitir instancias de Pago o sus subclases
        if (!(pago instanceof Pago)) {
            throw new Error("Pago inválido. Debe ser una instancia de la clase Pago o sus subclases.");
        }
    }

    static validarTienda(tienda) {
        if (!(tienda instanceof Tienda)) {
            throw new Error("Tienda inválida. Debe ser una instancia de la clase Tienda.");
        }
    }

    static validarCliente(cliente) {
        if (!(cliente instanceof Cliente)) {
            throw new Error("Cliente inválido. Debe ser una instancia de la clase Cliente.");
        }
    }

    generarFacturaOnline() {
        return `FacturaOnline-QR-${this.numero_factura}-${Date.now()}`;
    }

    obtenerDetalles() {
        return {
            numero_factura: this.numero_factura,
            fecha: this.fecha.toISOString(),
            total: this.total,
            tipoDePago: this.pago.constructor.name, 
            tienda: {
                nombre_tienda: this.tienda.nombre_tienda,
                ubicacion: this.tienda.ubicacion,
                telefono: this.tienda.telefono,
                codigo_autorizacion: this.tienda.codigo_autorizacion,
                nit: this.tienda.nit
            },
            cliente: {
                id: this.cliente.id,
                nombreYApellido: this.cliente.nombreYApellido,
                nit: this.cliente.nit
            },
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