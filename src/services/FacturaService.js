// src/services/FacturaService.js
import { Factura } from '../models/Factura.js';
import { Venta } from '../models/Venta.js';
import { ItemVenta } from '../models/ItemVenta.js';
import { Producto } from '../models/Producto.js';
import { PagoCash } from '../models/PagoCash.js';
import { PagoQR } from '../models/PagoQR.js';
import { PagoTarjeta } from '../models/PagoTarjeta.js';
import { Tienda } from '../models/Tienda.js';
import { Cliente } from '../models/Cliente.js';

export class FacturaService {

    static guardarFactura(factura) {
        const facturasExistentes = JSON.parse(localStorage.getItem('facturas') || '[]');
        facturasExistentes.push(factura);
        localStorage.setItem('facturas', JSON.stringify(facturasExistentes));
    }

    static obtenerFacturasPorClienteNit(nit) {
        const facturasGuardadas = JSON.parse(localStorage.getItem('facturas') || '[]');
        const facturasFiltradas = facturasGuardadas.filter(f => f.cliente && f.cliente.nit === nit);
        return facturasFiltradas.map(facturaData => {
            const cliente = new Cliente(facturaData.cliente.id, facturaData.cliente.nombreYApellido, facturaData.cliente.nit);
            const tienda = new Tienda(
                facturaData.tienda.nombre_tienda, 
                facturaData.tienda.ubicacion, 
                facturaData.tienda.telefono, 
                facturaData.tienda.codigo_autorizacion, 
                facturaData.tienda.nit
            );
            const venta = new Venta();
            facturaData.venta.items.forEach(itemData => {
                const producto = new Producto(itemData.producto.id, itemData.producto.nombre, itemData.producto.precio);
                const itemVenta = new ItemVenta(itemData.cantidad, producto);
                venta.agregarItem(itemVenta);
            });
            let pago;
            if (facturaData.pago.numeroTarjeta) {
                pago = new PagoTarjeta(facturaData.pago.monto, facturaData.pago.montoEnLetras, facturaData.pago.numeroTarjeta);
            } else if (facturaData.pago.tipo === 'QR') {
                pago = new PagoQR(facturaData.pago.monto, facturaData.pago.montoEnLetras);
            } else {
                pago = new PagoCash(facturaData.pago.monto, facturaData.pago.montoEnLetras);
            }
            const facturaCompleta = new Factura(
                facturaData.numero_factura,
                new Date(facturaData.fecha),
                venta,
                pago,
                tienda,
                cliente
            );
            
            return facturaCompleta;
        });
    }
}