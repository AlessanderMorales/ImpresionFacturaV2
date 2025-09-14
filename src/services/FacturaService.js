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

const FACTURAS_STORAGE_KEY = 'facturas_tienda';

// Helper function to reconstruct complex objects from plain JSON
function reconstructFactura(facturaData) {
    if (!facturaData) return null;

    const reconstructedTienda = new Tienda(
        facturaData.tienda.nombre_tienda,
        facturaData.tienda.ubicacion,
        facturaData.tienda.telefono,
        facturaData.tienda.codigo_autorizacion,
        facturaData.tienda.nit
    );

    const reconstructedCliente = new Cliente(
        facturaData.cliente.id,
        facturaData.cliente.nombreYApellido,
        facturaData.cliente.nit
    );

    const reconstructedVenta = new Venta();
    facturaData.ventaDetalles.forEach(itemData => {
        const product = new Producto(itemData.producto.id, itemData.producto.nombre, itemData.producto.precioUnitario);
        const itemVenta = new ItemVenta(itemData.cantidad, product);
        // Ensure subtotal is calculated if not present or incorrect
        itemVenta.subtotal = itemData.subtotal || itemVenta.calcularSubtotal();
        reconstructedVenta.agregarItem(itemVenta);
    });

    let reconstructedPago;
    // Determine the correct Pago subclass and reconstruct it
    switch (facturaData.tipoDePago) {
        case 'PagoCash':
            reconstructedPago = new PagoCash(facturaData.pago.monto, facturaData.pago.montoEnLetras);
            break;
        case 'PagoQR':
            // Assume codigoQR is stored if available, otherwise generate default
            reconstructedPago = new PagoQR(facturaData.pago.monto, facturaData.pago.montoEnLetras, facturaData.pago.codigoQR);
            break;
        case 'PagoTarjeta':
            reconstructedPago = new PagoTarjeta(facturaData.pago.monto, facturaData.pago.montoEnLetras, facturaData.pago.numeroTarjeta);
            break;
        default:
            throw new Error(`Tipo de pago desconocido: ${facturaData.tipoDePago}`);
    }

    return new Factura(
        facturaData.numero_factura,
        new Date(facturaData.fecha),
        reconstructedVenta,
        reconstructedPago,
        reconstructedTienda,
        reconstructedCliente
    );
}


export class FacturaService {
    static obtenerTodasLasFacturas() {
        const facturasData = JSON.parse(localStorage.getItem(FACTURAS_STORAGE_KEY)) || [];
        // Reconstruct each factura object from its plain data
        return facturasData.map(data => reconstructFactura(data.obtenerDetalles ? data.obtenerDetalles() : data));
    }

    static guardarFactura(factura) {
        if (!(factura instanceof Factura)) {
            throw new Error("El objeto a guardar no es una instancia de Factura.");
        }
        const facturas = FacturaService.obtenerTodasLasFacturas();
        // Check if a factura with the same number already exists
        const index = facturas.findIndex(f => f.numero_factura === factura.numero_factura);
        if (index !== -1) {
            facturas[index] = factura; // Update existing
        } else {
            facturas.push(factura); // Add new
        }
        
        // When saving, convert Factura object to a plain object that can be stringified
        // The Factura class already has `obtenerDetalles` which is suitable for this.
        const facturasToSave = facturas.map(f => f.obtenerDetalles());
        localStorage.setItem(FACTURAS_STORAGE_KEY, JSON.stringify(facturasToSave));
    }

    static obtenerFacturasPorClienteNit(nit) {
        const todasLasFacturas = FacturaService.obtenerTodasLasFacturas();
        return todasLasFacturas.filter(factura => factura.cliente.nit === nit);
    }

    // New: Eliminar todas las facturas (útil para desarrollo/limpieza)
    static limpiarTodasLasFacturas() {
        localStorage.removeItem(FACTURAS_STORAGE_KEY);
        console.log("Todas las facturas han sido eliminadas de localStorage.");
    }
}