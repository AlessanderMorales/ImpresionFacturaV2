// adminPresenter.js
import { Producto } from './src/models/Producto.js';
import { Tienda } from './src/models/Tienda.js';
import { ProductoService } from './src/services/ProductoService.js';
import { TiendaService } from './src/services/TiendaService.js';
import { FacturaService } from './src/services/FacturaService.js'; 
import { PagoCash } from './src/models/PagoCash.js';
import { PagoQR } from './src/models/PagoQR.js';
import { PagoTarjeta } from './src/models/PagoTarjeta.js';
const { jsPDF } = window.jspdf;

// Elementos de la UI para datos de la tienda
const adminNombreTiendaInput = document.getElementById('admin-nombre-tienda');
const adminUbicacionInput = document.getElementById('admin-ubicacion');
const adminTelefonoInput = document.getElementById('admin-telefono');
const adminCodigoAutorizacionInput = document.getElementById('admin-codigo-autorizacion');
const adminNitInput = document.getElementById('admin-nit');
const btnGuardarTienda = document.getElementById('btn-guardar-tienda');

// Elementos de la UI para gestión de productos
const productAdminListDiv = document.getElementById('product-admin-list');
const adminProductIdInput = document.getElementById('admin-product-id');
const adminProductNameInput = document.getElementById('admin-product-name');
const adminProductPriceInput = document.getElementById('admin-product-price');
const btnGuardarProducto = document.getElementById('btn-guardar-producto');
const btnCancelarEdicion = document.getElementById('btn-cancelar-edicion');

// NEW UI elements for invoice administration
const adminInvoiceSearchInput = document.getElementById('admin-invoice-search-input');
const btnSearchAdminInvoices = document.getElementById('btn-search-admin-invoices');
const adminInvoiceListDiv = document.getElementById('admin-invoice-list');
const btnShowAllAdminInvoices = document.getElementById('btn-show-all-admin-invoices'); // NEW button


function cargarDatosTienda() {
    const tienda = TiendaService.obtenerTiendaPorNombre("TecnoOutlet Central"); // Asumiendo una única tienda principal
    if (tienda) {
        adminNombreTiendaInput.value = tienda.nombre_tienda;
        adminUbicacionInput.value = tienda.ubicacion;
        adminTelefonoInput.value = tienda.telefono;
        adminCodigoAutorizacionInput.value = tienda.codigo_autorizacion;
        adminNitInput.value = tienda.nit;
    }
}

function guardarDatosTienda() {
    try {
        const nombre_tienda = adminNombreTiendaInput.value.trim();
        const ubicacion = adminUbicacionInput.value.trim();
        const telefono = parseInt(adminTelefonoInput.value, 10);
        const codigo_autorizacion = parseInt(adminCodigoAutorizacionInput.value, 10);
        const nit = parseInt(adminNitInput.value, 10);

        const nuevaTienda = new Tienda(nombre_tienda, ubicacion, telefono, codigo_autorizacion, nit);
        TiendaService.guardarTienda(nuevaTienda);
        alert('Datos de la tienda guardados exitosamente.');
    } catch (error) {
        alert(`Error al guardar datos de la tienda: ${error.message}`);
        console.error(error);
    }
}

function renderizarProductosAdmin() {
    productAdminListDiv.innerHTML = '';
    const productos = ProductoService.obtenerTodosLosProductos();

    if (productos.length === 0) {
        productAdminListDiv.innerHTML = '<p>No hay productos registrados.</p>';
        return;
    }

    productos.forEach(producto => {
        const productItemDiv = document.createElement('div');
        productItemDiv.className = 'product-item';
        productItemDiv.innerHTML = `
            <span>ID: ${producto.id} - ${producto.nombre} - Bs. ${producto.precio.toFixed(2)}</span>
            <div>
                <button data-id="${producto.id}" class="btn-editar-producto">Editar</button>
                <button data-id="${producto.id}" class="btn-eliminar-producto">Eliminar</button>
            </div>
        `;
        productAdminListDiv.appendChild(productItemDiv);
    });

    document.querySelectorAll('.btn-editar-producto').forEach(button => {
        button.addEventListener('click', (e) => cargarProductoParaEdicion(parseInt(e.target.dataset.id, 10)));
    });

    document.querySelectorAll('.btn-eliminar-producto').forEach(button => {
        button.addEventListener('click', (e) => eliminarProducto(parseInt(e.target.dataset.id, 10)));
    });
}

function cargarProductoParaEdicion(id) {
    const producto = ProductoService.obtenerProductoPorId(id);
    if (producto) {
        adminProductIdInput.value = producto.id;
        adminProductNameInput.value = producto.nombre;
        adminProductPriceInput.value = producto.precio;
        btnCancelarEdicion.style.display = 'inline-block';
        btnGuardarProducto.textContent = 'Actualizar Producto';
    }
}

function guardarProducto() {
    try {
        const id = adminProductIdInput.value ? parseInt(adminProductIdInput.value, 10) : 0;
        const nombre = adminProductNameInput.value.trim();
        const precio = parseFloat(adminProductPriceInput.value);

        if (!nombre) throw new Error("El nombre del producto no puede estar vacío.");
        if (isNaN(precio) || precio <= 0) throw new Error("El precio debe ser un número positivo.");

        let producto;
        if (id) {
            producto = new Producto(id, nombre, precio);
            ProductoService.actualizarProducto(producto);
        } else {
            const newId = ProductoService.generarNuevoIdProducto();
            producto = new Producto(newId, nombre, precio);
            ProductoService.agregarProducto(producto);
        }

        alert('Producto guardado exitosamente.');
        limpiarFormularioProducto();
        renderizarProductosAdmin();
        window.dispatchEvent(new Event('productosActualizados'));

    } catch (error) {
        alert(`Error al guardar el producto: ${error.message}`);
        console.error(error);
    }
}

function eliminarProducto(id) {
    if (confirm(`¿Está seguro de que desea eliminar el producto con ID ${id}?`)) {
        try {
            ProductoService.eliminarProducto(id);
            alert('Producto eliminado.');
            renderizarProductosAdmin();
            window.dispatchEvent(new Event('productosActualizados'));
        } catch (error) {
            alert(`Error al eliminar el producto: ${error.message}`);
            console.error(error);
        }
    }
}

function limpiarFormularioProducto() {
    adminProductIdInput.value = '';
    adminProductNameInput.value = '';
    adminProductPriceInput.value = '';
    btnCancelarEdicion.style.display = 'none';
    btnGuardarProducto.textContent = 'Guardar Producto';
}



function renderizarFacturasAdmin(facturas) {
    adminInvoiceListDiv.innerHTML = '';

    if (facturas.length === 0) {
        adminInvoiceListDiv.innerHTML = '<p>No se encontraron facturas con los criterios de búsqueda.</p>';
        return;
    }

    const ul = document.createElement('ul');
    facturas.forEach(factura => {
        const facturaDetalles = factura.obtenerDetalles(); 
        
        const li = document.createElement('li');
        li.className = 'invoice-item';
        li.innerHTML = `
            <div>
                <b>Factura #${facturaDetalles.numero_factura}</b> - Fecha: ${new Date(facturaDetalles.fecha).toLocaleDateString()} ${new Date(facturaDetalles.fecha).toLocaleTimeString()}
                <br>
                Cliente: ${facturaDetalles.cliente.nombreYApellido} (NIT: ${facturaDetalles.cliente.nit})
                <br>
                Total: Bs. ${facturaDetalles.total.toFixed(2)} (Pago: ${facturaDetalles.tipoDePago})
                <button class="btn-descargar-pdf" data-factura-id="${factura.numero_factura}">Descargar PDF</button>
            </div>
            <details class="invoice-details">
                <summary>Ver Detalles Completos</summary>
                <pre>${JSON.stringify(facturaDetalles, null, 2)}</pre>
            </details>
        `;
        ul.appendChild(li);
    });
    adminInvoiceListDiv.appendChild(ul);

   document.querySelectorAll('.btn-descargar-pdf').forEach(button => {
        button.addEventListener('click', (event) => {
            console.log("Botón Descargar PDF clickeado."); 

            const facturaIdString = event.target.dataset.facturaId;
          
            const facturaId = parseInt(facturaIdString, 10);
            console.log(`Intentando buscar factura con ID (numérico): ${facturaId}`); 

            const todasLasFacturas = FacturaService.obtenerTodasLasFacturas();
            console.log(`Total de facturas cargadas: ${todasLasFacturas.length}`); 
        
            const facturaParaDescargar = todasLasFacturas.find(f => parseInt(f.numero_factura, 10) === facturaId);

            if (facturaParaDescargar) {
                console.log(`Factura encontrada: ${facturaParaDescargar.numero_factura}`); 
                generarPdfFactura(facturaParaDescargar);
            } else {
                alert('No se pudo encontrar la factura para descargar.');
                console.error(`Factura con ID ${facturaId} (numérico) no encontrada.`); 
            }
        });
    });
}

function buscarFacturasAdmin() {
    const searchTerm = adminInvoiceSearchInput.value.trim();
    let facturasFiltradas = [];

    const todasLasFacturas = FacturaService.obtenerTodasLasFacturas();

    if (searchTerm === '') {
        
        facturasFiltradas = todasLasFacturas;
    } else {
       
        const nitSearch = parseInt(searchTerm, 10);
        if (!isNaN(nitSearch) && nitSearch > 0) {
            facturasFiltradas = todasLasFacturas.filter(factura =>
                factura.cliente && factura.cliente.nit === nitSearch
            );
        } else {
            
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            facturasFiltradas = todasLasFacturas.filter(factura =>
                String(factura.numero_factura).includes(lowerCaseSearchTerm) ||
                (factura.cliente && factura.cliente.nombreYApellido.toLowerCase().includes(lowerCaseSearchTerm)) ||
                (factura.tienda && factura.tienda.nombre_tienda.toLowerCase().includes(lowerCaseSearchTerm))
            );
        }
    }
    renderizarFacturasAdmin(facturasFiltradas);
}


function generarPdfFactura(factura) {
    try {
        const doc = new jsPDF();
        const margin = 15;
        let y = margin;
        const lineHeight = 7;
        const maxWidth = doc.internal.pageSize.getWidth() - 2 * margin;

        
        if (!factura) {
            console.error("Error: La factura proporcionada es undefined o null.");
            alert("No se puede generar el PDF: La factura no es válida.");
            return;
        }
        if (!factura.tienda) {
            console.error("Error: Los datos de la tienda en la factura son undefined o null.", factura);
            alert("No se puede generar el PDF: Faltan datos de la tienda.");
            return;
        }
        if (!factura.cliente) {
            console.error("Error: Los datos del cliente en la factura son undefined o null.", factura);
            alert("No se puede generar el PDF: Faltan datos del cliente.");
            return;
        }
        if (!factura.venta || !factura.venta.items || factura.venta.items.length === 0) {
            console.error("Error: La venta o los items de venta en la factura son inválidos o están vacíos.", factura);
            alert("No se puede generar el PDF: Faltan productos en la factura.");
            return;
        }
        
        if (!(factura.fecha instanceof Date)) {
            console.error("Error: factura.fecha no es un objeto Date. Intentando convertir...", factura.fecha);
            factura.fecha = new Date(factura.fecha);
            if (isNaN(factura.fecha.getTime())) { 
                alert("No se puede generar el PDF: La fecha de la factura no es válida.");
                return;
            }
        }


        
        doc.setFontSize(22);
        doc.text("FACTURA", doc.internal.pageSize.getWidth() / 2, y, { align: "center" });
        y += lineHeight * 2;

        doc.setFontSize(10);
        doc.text(`Nº de Factura: ${factura.numero_factura}`, margin, y);
        y += lineHeight;
        doc.text(`Fecha: ${factura.fecha.toLocaleDateString()} ${factura.fecha.toLocaleTimeString()}`, margin, y);
        y += lineHeight * 2;

       
        doc.setFontSize(12);
        doc.text("Datos de la Tienda:", margin, y);
        y += lineHeight;
        doc.setFontSize(10);
        doc.text(`Nombre: ${factura.tienda.nombre_tienda}`, margin, y);
        y += lineHeight;
        doc.text(`NIT: ${factura.tienda.nit}`, margin, y);
        y += lineHeight;
        doc.text(`Ubicación: ${factura.tienda.ubicacion}`, margin, y);
        y += lineHeight;
        doc.text(`Teléfono: ${factura.tienda.telefono}`, margin, y);
        y += lineHeight * 2;

        
        doc.setFontSize(12);
        doc.text("Datos del Cliente:", margin, y);
        y += lineHeight;
        doc.setFontSize(10);
        doc.text(`Nombre: ${factura.cliente.nombreYApellido}`, margin, y);
        y += lineHeight;
        doc.text(`NIT/CI: ${factura.cliente.nit}`, margin, y);
        y += lineHeight * 2;

       
        doc.setFontSize(12);
        doc.text("Detalle de la Venta:", margin, y);
        y += lineHeight;
        doc.setFontSize(10);

       
        const colCantidad = margin;
        const colProducto = margin + 20; 
        const colPrecioUnitario = margin + 100; 
        const colSubtotal = margin + 140; 

        doc.text("Cant.", colCantidad, y);
        doc.text("Producto", colProducto, y);
        doc.text("P. Unit.", colPrecioUnitario, y);
        doc.text("Subtotal", colSubtotal, y);
        y += lineHeight;
        doc.line(margin, y, doc.internal.pageSize.getWidth() - margin, y); 
        y += 2; 

        
        factura.venta.items.forEach(item => {
            if (y > doc.internal.pageSize.getHeight() - margin - (lineHeight * 3)) { 
                doc.addPage();
                y = margin;
                doc.setFontSize(10);
                doc.text("Cant.", colCantidad, y);
                doc.text("Producto", colProducto, y);
                doc.text("P. Unit.", colPrecioUnitario, y);
                doc.text("Subtotal", colSubtotal, y);
                y += lineHeight;
                doc.line(margin, y, doc.internal.pageSize.getWidth() - margin, y);
                y += 2;
            }

            doc.text(String(item.cantidad), colCantidad, y);
            doc.text(item.producto.nombre, colProducto, y);
            doc.text(`Bs. ${item.producto.precio.toFixed(2)}`, colPrecioUnitario, y);
            doc.text(`Bs. ${item.subtotal.toFixed(2)}`, colSubtotal, y);
            y += lineHeight;
        });

        y += lineHeight;
        doc.setFontSize(12);
        doc.text(`Total: Bs. ${factura.total.toFixed(2)}`, margin, y);
        y += lineHeight;
        const montoEnLetras = factura.pago && factura.pago.montoEnLetras ? factura.pago.montoEnLetras : "Monto en letras no disponible";
        doc.text(`Monto en letras: ${montoEnLetras}`, margin, y, { maxWidth: maxWidth });
        y += lineHeight;

        let tipoDePago = "Desconocido";
        if (factura.pago) {
            if (factura.pago instanceof PagoTarjeta) {
                tipoDePago = 'Tarjeta';
            } else if (factura.pago instanceof PagoQR) {
                tipoDePago = 'QR';
            } else if (factura.pago instanceof PagoCash) {
                tipoDePago = 'Efectivo';
            } else if (factura.pago.tipo) {
                tipoDePago = factura.pago.tipo;
            }
        }
        doc.text(`Tipo de Pago: ${tipoDePago}`, margin, y);
        y += lineHeight * 3;

        doc.setFontSize(10);
        doc.text("¡Gracias por su compra!", doc.internal.pageSize.getWidth() / 2, y, { align: "center" });

        // Guardar el PDF
        doc.save(`factura_${factura.numero_factura}.pdf`);
        console.log(`PDF de factura ${factura.numero_factura} generado y descargado.`);

    } catch (error) {
        console.error("Error al generar el PDF de la factura:", error);
        alert(`Ocurrió un error al intentar descargar la factura: ${error.message}. Revise la consola para más detalles.`);
    }
}

// Event Listeners
btnGuardarTienda.addEventListener('click', guardarDatosTienda);
btnGuardarProducto.addEventListener('click', guardarProducto);
btnCancelarEdicion.addEventListener('click', limpiarFormularioProducto);

// NEW Event Listeners for invoice administration
btnSearchAdminInvoices.addEventListener('click', buscarFacturasAdmin);
btnShowAllAdminInvoices.addEventListener('click', () => {
    adminInvoiceSearchInput.value = ''; // Clear search field
    buscarFacturasAdmin(); // Show all
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    console.log("--- Interfaz de Administración Iniciada ---");
    cargarDatosTienda();
    renderizarProductosAdmin();
    buscarFacturasAdmin(); // Load all invoices on initial page load for admin
});