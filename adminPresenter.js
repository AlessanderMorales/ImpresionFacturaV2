 import { Producto } from './src/models/Producto.js';
import { Tienda } from './src/models/Tienda.js';
import { ProductoService } from './src/services/ProductoService.js';
import { TiendaService } from './src/services/TiendaService.js';

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
        TiendaService.guardarTienda(nuevaTienda); // Este método lo crearemos en TiendaService
        alert('Datos de la tienda guardados exitosamente.');
    } catch (error) {
        alert(`Error al guardar datos de la tienda: ${error.message}`);
        console.error(error);
    }
}

function renderizarProductosAdmin() {
    productAdminListDiv.innerHTML = '';
    const productos = ProductoService.obtenerTodosLosProductos(); // Este método ya existe

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
        const id = adminProductIdInput.value ? parseInt(adminProductIdInput.value, 10) : 0; // 0 si es nuevo, id si edita
        const nombre = adminProductNameInput.value.trim();
        const precio = parseFloat(adminProductPriceInput.value);

        if (!nombre) throw new Error("El nombre del producto no puede estar vacío.");
        if (isNaN(precio) || precio <= 0) throw new Error("El precio debe ser un número positivo.");

        let producto;
        if (id) {
            // Editando un producto existente
            producto = new Producto(id, nombre, precio);
            ProductoService.actualizarProducto(producto); // Este método lo crearemos
        } else {
            // Añadiendo un nuevo producto (generamos un nuevo ID simple)
            const newId = ProductoService.generarNuevoIdProducto(); // Este método lo crearemos
            producto = new Producto(newId, nombre, precio);
            ProductoService.agregarProducto(producto); // Este método lo crearemos
        }
        
        alert('Producto guardado exitosamente.');
        limpiarFormularioProducto();
        renderizarProductosAdmin();
        // Disparar un evento para que la vista de facturación se actualice si está abierta
        window.dispatchEvent(new Event('productosActualizados')); 

    } catch (error) {
        alert(`Error al guardar el producto: ${error.message}`);
        console.error(error);
    }
}

function eliminarProducto(id) {
    if (confirm(`¿Está seguro de que desea eliminar el producto con ID ${id}?`)) {
        ProductoService.eliminarProducto(id); // Este método lo crearemos
        alert('Producto eliminado.');
        renderizarProductosAdmin();
        window.dispatchEvent(new Event('productosActualizados'));
    }
}

function limpiarFormularioProducto() {
    adminProductIdInput.value = '';
    adminProductNameInput.value = '';
    adminProductPriceInput.value = '';
    btnCancelarEdicion.style.display = 'none';
    btnGuardarProducto.textContent = 'Guardar Producto';
}


// Event Listeners
btnGuardarTienda.addEventListener('click', guardarDatosTienda);
btnGuardarProducto.addEventListener('click', guardarProducto);
btnCancelarEdicion.addEventListener('click', limpiarFormularioProducto);

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    console.log("--- Interfaz de Administración Iniciada ---");
    cargarDatosTienda();
    renderizarProductosAdmin();
});