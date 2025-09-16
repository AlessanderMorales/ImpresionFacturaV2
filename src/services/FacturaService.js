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
import { Pago } from '../models/Pago.js'; // Importa la clase base Pago

export class FacturaService {

    static guardarFactura(factura) {
        const facturasExistentes = JSON.parse(localStorage.getItem('facturas') || '[]');
        // Al guardar, solo necesitamos los datos planos para serializar correctamente
        facturasExistentes.push({
            numero_factura: factura.numero_factura,
            fecha: factura.fecha.toISOString(),
            venta: {
                items: factura.venta.items.map(item => ({
                    cantidad: item.cantidad,
                    producto: {
                        id: item.producto.id,
                        nombre: item.producto.nombre,
                        precio: item.producto.precio
                    },
                    subtotal: item.subtotal
                }))
            },
            pago: {
                monto: factura.pago.monto,
                montoEnLetras: factura.pago.montoEnLetras,
                // Guardar propiedades específicas del tipo de pago
                ...(factura.pago instanceof PagoTarjeta && { numeroTarjeta: factura.pago.numeroTarjeta }),
                ...(factura.pago instanceof PagoQR && { tipo: 'QR' }), // Marcar QR explícitamente si es necesario
                ...(factura.pago instanceof PagoCash && { tipo: 'CASH' }) // Marcar CASH explícitamente
            },
            tienda: {
                nombre_tienda: factura.tienda.nombre_tienda,
                ubicacion: factura.tienda.ubicacion,
                telefono: factura.tienda.telefono,
                codigo_autorizacion: factura.tienda.codigo_autorizacion,
                nit: factura.tienda.nit
            },
            cliente: {
                id: factura.cliente.id,
                nombreYApellido: factura.cliente.nombreYApellido,
                nit: factura.cliente.nit
            },
            total: factura.total,
            facturaOnline: factura.facturaOnline
        });
        localStorage.setItem('facturas', JSON.stringify(facturasExistentes));
    }

    // Método auxiliar para reconstruir una factura desde datos JSON
    static reconstruirFactura(facturaData) {
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
        // Reconstrucción inteligente del objeto de pago
        if (facturaData.pago.numeroTarjeta) {
            pago = new PagoTarjeta(facturaData.pago.monto, facturaData.pago.montoEnLetras, facturaData.pago.numeroTarjeta);
        } else if (facturaData.pago.tipo === 'QR') {
            pago = new PagoQR(facturaData.pago.monto, facturaData.pago.montoEnLetras);
        } else if (facturaData.pago.tipo === 'CASH') {
            pago = new PagoCash(facturaData.pago.monto, facturaData.pago.montoEnLetras);
        } else {
            // Fallback si el tipo no está claramente definido, asumir Cash por defecto o manejar error
            console.warn("Tipo de pago desconocido, se asume PagoCash.");
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
        facturaCompleta.total = facturaData.total; // Restaurar total si se guardó por separado
        facturaCompleta.facturaOnline = facturaData.facturaOnline; // Restaurar facturaOnline
        
        return facturaCompleta;
    }

    static obtenerTodasLasFacturas() {
        const facturasGuardadas = JSON.parse(localStorage.getItem('facturas') || '[]');
        return facturasGuardadas.map(facturaData => FacturaService.reconstruirFactura(facturaData));
    }

    static obtenerFacturasPorClienteNit(nit) {
        const facturasGuardadas = JSON.parse(localStorage.getItem('facturas') || '[]');
        const facturasFiltradas = facturasGuardadas.filter(f => f.cliente && f.cliente.nit === nit);
        return facturasFiltradas.map(facturaData => FacturaService.reconstruirFactura(facturaData));
    }
}