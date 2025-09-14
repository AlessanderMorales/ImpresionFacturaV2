// adminPresenter.js
import { Producto } from './src/models/Producto.js';
import { Tienda } from './src/models/Tienda.js';
import { ProductoService } from './src/services/ProductoService.js';
import { TiendaService } from './src/services/TiendaService.js';
import { FacturaService } from './src/services/FacturaService.js'; // NEW: Import FacturaService

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

// NEW: Invoice Administration Functions

function renderizarFacturasAdmin(facturas) {
    adminInvoiceListDiv.innerHTML = ''; // Clear previous results

    if (facturas.length === 0) {
        adminInvoiceListDiv.innerHTML = '<p>No se encontraron facturas con los criterios de búsqueda.</p>';
        return;
    }

    const ul = document.createElement('ul');
    facturas.forEach(factura => {
        const li = document.createElement('li');
        li.className = 'invoice-item';
        li.innerHTML = `
            <div>
                <b>Factura #${factura.numero_factura}</b> - Fecha: ${new Date(factura.fecha).toLocaleDateString()} ${new Date(factura.fecha).toLocaleTimeString()}
                <br>
                Cliente: ${factura.cliente.nombreYApellido} (NIT: ${factura.cliente.nit})
                <br>
                Total: Bs. ${factura.total.toFixed(2)} (${factura.tipoDePago})
            </div>
            <details class="invoice-details">
                <summary>Ver Detalles Completos</summary>
                <pre>${JSON.stringify(factura.obtenerDetalles(), null, 2)}</pre>
            </details>
        `;
        ul.appendChild(li);
    });
    adminInvoiceListDiv.appendChild(ul);
}

function buscarFacturasAdmin() {
    const searchTerm = adminInvoiceSearchInput.value.trim();
    let facturasFiltradas = [];

    const todasLasFacturas = FacturaService.obtenerTodasLasFacturas();

    if (searchTerm === '') {
        // If search term is empty, show all invoices
        facturasFiltradas = todasLasFacturas;
    } else {
        // Try to parse as number for NIT search
        const nitSearch = parseInt(searchTerm, 10);
        if (!isNaN(nitSearch) && nitSearch > 0) {
            facturasFiltradas = todasLasFacturas.filter(factura => 
                factura.cliente.nit === nitSearch
            );
        } else {
            // General text search (e.g., by client name or invoice number string)
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            facturasFiltradas = todasLasFacturas.filter(factura => 
                String(factura.numero_factura).includes(lowerCaseSearchTerm) ||
                factura.cliente.nombreYApellido.toLowerCase().includes(lowerCaseSearchTerm) ||
                factura.tienda.nombre_tienda.toLowerCase().includes(lowerCaseSearchTerm)
            );
        }
    }
    renderizarFacturasAdmin(facturasFiltradas);
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