// Importar clases de modelos
import { Cliente } from './models/Cliente.js';
import { Producto } from './models/Producto.js';
import { ItemVenta } from './models/ItemVenta.js';
import { Venta } from './models/Venta.js';
import { Tienda } from './models/Tienda.js';
import { Factura } from './models/Factura.js';
import { CreadorPagoCash } from './models/CreadorPagoCash.js';
import { CreadorPagoTarjeta } from './models/CreadorPagoTarjeta.js';
import { CreadorPagoQR } from './models/CreadorPagoQR.js';

// Importar servicios
import { ClienteService } from './services/ClienteService.js';
import { ProductoService } from './services/ProductoService.js';
import { TiendaService } from './services/TiendaService.js';

/**
 * Función principal para simular una compra y generar una factura.
 */
function simularCompraYFactura() {
    console.log("--- Iniciando Simulación de Compra y Factura ---");

    // 1. Obtener datos de Cliente, Productos y Tienda desde los servicios (simulando backend)
    const cliente = ClienteService.obtenerClientePorId("C001");
    const producto1 = ProductoService.obtenerProductoPorId(101); // Laptop Gamer
    const producto2 = ProductoService.obtenerProductoPorId(103); // Mouse Inalámbrico
    const tienda = TiendaService.obtenerTiendaPorNombre("TecnoOutlet Central");

    if (!cliente || !producto1 || !producto2 || !tienda) {
        console.error("Error: No se pudieron obtener todos los datos necesarios para la simulación.");
        return;
    }

    console.log("\nDatos recuperados:");
    console.log("Cliente:", cliente);
    console.log("Producto 1:", producto1);
    console.log("Producto 2:", producto2);
    console.log("Tienda:", tienda);

    // 2. Crear ítems de venta
    const itemVenta1 = new ItemVenta(1, producto1);
    const itemVenta2 = new ItemVenta(2, producto2);

    // 3. Crear una venta y agregar ítems
    const venta = new Venta();
    venta.agregarItem(itemVenta1);
    venta.agregarItem(itemVenta2);

    console.log("\nDetalles de la Venta:");
    venta.items.forEach(item => console.log(`- ${item.cantidad}x ${item.producto.nombre} @ ${item.producto.precio} = ${item.subtotal}`));
    console.log(`Total de la Venta: ${venta.calcularTotal().toFixed(2)}`);

    // 4. Crear un pago utilizando el Factory Method
    let creadorPago;
    let pagoRealizado;

    // Ejemplo de pago con tarjeta
    creadorPago = new CreadorPagoTarjeta(venta.calcularTotal(), "Trescientos cincuenta y ocho con cero cero", "4111222233334444");
    pagoRealizado = creadorPago.crearPago();
    console.log("\n--- Pago con Tarjeta ---");
    console.log(pagoRealizado.realizarPago());

    // Si quisieras cambiar el tipo de pago, solo cambiarías el creador:
    // creadorPago = new CreadorPagoCash(venta.calcularTotal(), "Trescientos cincuenta y ocho con cero cero");
    // pagoRealizado = creadorPago.crearPago();
    // console.log("\n--- Pago en Efectivo ---");
    // console.log(pagoRealizado.realizarPago());

    // 5. Crear la Factura
    const fechaActual = new Date();
    const numeroFactura = 20250913001; // Ejemplo de número de factura

    const factura = new Factura(
        numeroFactura,
        fechaActual,
        venta,
        pagoRealizado, // Aquí pasamos el objeto Pago ya creado
        tienda,
        cliente
    );

    console.log("\n--- Factura Generada ---");
    console.log(factura.obtenerDetalles());

    // Ejemplo de otro pago con QR
    console.log("\n--- Nueva Venta con Pago QR ---");
    const producto3 = ProductoService.obtenerProductoPorId(102); // Teclado Mecánico
    const ventaQR = new Venta();
    ventaQR.agregarItem(new ItemVenta(1, producto3));

    const creadorPagoQR = new CreadorPagoQR(ventaQR.calcularTotal(), "Ochenta y cinco con cincuenta");
    const pagoQR = creadorPagoQR.crearPago(); // Esto también generará el QR

    const facturaQR = new Factura(
        20250913002,
        new Date(),
        ventaQR,
        pagoQR,
        tienda,
        ClienteService.obtenerClientePorId("C002")
    );
    console.log(facturaQR.obtenerDetalles());
}

// Ejecutar la simulación
simularCompraYFactura();