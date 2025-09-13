// presenter.js (Archivo en el raíz del proyecto)

// Importar clases de modelos
import { Cliente } from './src/models/Cliente.js';
import { Producto } from './src/models/Producto.js';
import { ItemVenta } from './src/models/ItemVenta.js';
import { Venta } from './src/models/Venta.js';
import { Tienda } from './src/models/Tienda.js';
import { Factura } from './src/models/Factura.js';
import { CreadorPagoCash } from './src/models/CreadorDePagoCash.js'; // Asegúrate que el nombre del archivo sea CreadorDePagoCash.js
import { CreadorPagoTarjeta } from './src/models/CreadorPagoTarjeta.js';
// Se elimina la importación de CreadorPagoQR

// Importar servicios
import { ClienteService } from './src/services/ClienteService.js';
import { ProductoService } from './src/services/ProductoService.js';
import { TiendaService } from './src/services/TiendaService.js';

/**
 * Función principal para simular una compra y generar una factura.
 * Este archivo actúa como el 'presenter' o el punto de entrada de la aplicación.
 */
function simularCompraYFactura() {
    console.log("--- Iniciando Simulación de Compra y Factura (Presenter en Navegador) ---");

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

    // 4. Crear un pago utilizando el Factory Method (Ejemplo con Tarjeta)
    let creadorPago;
    let pagoRealizado;

    // Puedes elegir entre PagoCash o PagoTarjeta
    creadorPago = new CreadorPagoTarjeta(venta.calcularTotal(), "Trescientos cincuenta y ocho con cero cero", "4111222233334444");
    // O si prefieres en efectivo:
    // creadorPago = new CreadorPagoCash(venta.calcularTotal(), "Trescientos cincuenta y ocho con cero cero");

    pagoRealizado = creadorPago.crearPago();
    console.log("\n--- Pago Realizado ---");
    console.log(pagoRealizado.realizarPago());

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
}

// Ejecutar la simulación
simularCompraYFactura();