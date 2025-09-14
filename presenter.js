import { Cliente } from './src/models/Cliente.js';
import { ItemVenta } from './src/models/ItemVenta.js';
import { Venta } from './src/models/Venta.js';
import { Factura } from './src/models/Factura.js';
import { CreadorDePagoCash } from './src/models/CreadorDePagoCash.js';
import { CreadorPagoTarjeta } from './src/models/CreadorPagoTarjeta.js';
import { CreadorPagoQR } from './src/models/CreadorPagoQR.js'; 

//import { ClienteService } from './src/services/ClienteService.js';
import { ProductoService } from './src/services/ProductoService.js';
import { TiendaService } from './src/services/TiendaService.js';


const carrito = new Venta();
let productosDisponibles = []; 

const productListDiv = document.getElementById('product-list');
const cartItemsDiv = document.getElementById('cart-items');
const cartTotalDiv = document.getElementById('cart-total');
const clienteNombreInput = document.getElementById('cliente-nombre');
const clienteNitInput = document.getElementById('cliente-nit');
const btnGenerarFactura = document.getElementById('btn-generar-factura');
const facturaContainer = document.getElementById('factura-container');
const facturaResultadoPre = document.getElementById('factura-resultado');
const tarjetaInfoDiv = document.getElementById('tarjeta-info');
const qrInfoDiv = document.getElementById('qr-info'); 
const qrImage = document.getElementById('qr-image');   

const facturaQrDisplay = document.getElementById('factura-qr-display');
const facturaQrImage = document.getElementById('factura-qr-image');     

function renderizarProductos() {
    productosDisponibles = ProductoService.obtenerTodosLosProductos();
    productListDiv.innerHTML = ''; 
    
    productosDisponibles.forEach(producto => {
        const productoHTML = `
            <div class="cart-item">
                <span>${producto.nombre} - <b>Bs. ${producto.precio.toFixed(2)}</b></span>
                <button data-product-id="${producto.id}">Agregar al Carrito</button>
            </div>
        `;
        productListDiv.innerHTML += productoHTML;
    });

    document.querySelectorAll('[data-product-id]').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.productId, 10);
            const productoAAgregar = productosDisponibles.find(p => p.id === productId);
            if (productoAAgregar) {
                agregarAlCarrito(productoAAgregar);
            }
        });
    });
}


function agregarAlCarrito(producto) {
    const itemExistente = carrito.items.find(item => item.producto.id === producto.id);

    if (itemExistente) {
        itemExistente.cantidad++;
        itemExistente.subtotal = itemExistente.calcularSubtotal();
    } else {
        const itemVenta = new ItemVenta(1, producto);
        carrito.agregarItem(itemVenta);
    }
    renderizarCarrito();
}


function renderizarCarrito() {
    if (carrito.items.length === 0) {
        cartItemsDiv.innerHTML = '<p>El carrito está vacío.</p>';
    } else {
        cartItemsDiv.innerHTML = '';
        carrito.items.forEach(item => {
            const itemHTML = `
                <div class="cart-item">
                    <span>${item.cantidad}x ${item.producto.nombre} (Bs. ${item.producto.precio.toFixed(2)} c/u)</span>
                    <span>Bs. ${item.subtotal.toFixed(2)}</span>
                </div>
            `;
            cartItemsDiv.innerHTML += itemHTML;
        });
    }
    const total = carrito.calcularTotal();
    cartTotalDiv.textContent = `Total: Bs. ${total.toFixed(2)}`;
}



document.querySelectorAll('input[name="metodoPago"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        tarjetaInfoDiv.style.display = 'none';
        qrInfoDiv.style.display = 'none'; 

        if (e.target.value === 'tarjeta') {
            tarjetaInfoDiv.style.display = 'block';
        } else if (e.target.value === 'qr') {
            const totalActual = carrito.calcularTotal().toFixed(2);
            qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Pago%20Bs.${totalActual}-Ref-${Date.now()}`;
            qrInfoDiv.style.display = 'block';
        }
    });
});

btnGenerarFactura.addEventListener('click', () => {
    if (carrito.items.length === 0) {
        alert("El carrito está vacío. Agregue productos antes de generar la factura.");
        return;
    }

    const nombreCliente = clienteNombreInput.value.trim();
    const nitClienteStr = clienteNitInput.value.trim();

    if (!nombreCliente || !nitClienteStr) {
        alert("Por favor, ingrese el nombre y el NIT/CI del cliente.");
        return;
    }

    const nitClienteNum = parseInt(nitClienteStr, 10);
    if (isNaN(nitClienteNum) || nitClienteNum <= 0) {
        alert("El NIT/CI debe ser un número válido y positivo.");
        return;
    }

    let cliente;
    try {
       
        const clienteId = 'C-' + Date.now(); 
        cliente = new Cliente(clienteId, nombreCliente, nitClienteNum);
    } catch (error) {
        alert(`Error en los datos del cliente: ${error.message}`);
        return;
    }

    // Siempre obtenemos la tienda del servicio, que ahora la carga de localStorage
    const tienda = TiendaService.obtenerTiendaPorNombre("TecnoOutlet Central");
    if (!tienda) {
        alert("Error: No se pudieron cargar los datos de la tienda.");
        return;
    }

    const totalVenta = carrito.calcularTotal();

    const metodoPagoSeleccionado = document.querySelector('input[name="metodoPago"]:checked').value;
    let creadorPago;
    let montoEnLetras = "Monto en letras (ejemplo)"; 

    if (metodoPagoSeleccionado === 'tarjeta') {
        const numeroTarjeta = document.getElementById('numeroTarjeta').value;
        try {
            creadorPago = new CreadorPagoTarjeta(totalVenta, montoEnLetras, numeroTarjeta);
        } catch (error) {
            alert(`Error: ${error.message}`);
            return;
        }
    } else if (metodoPagoSeleccionado === 'qr') { 
        creadorPago = new CreadorPagoQR(totalVenta, montoEnLetras);
    }
    else { 
        creadorPago = new CreadorDePagoCash(totalVenta, montoEnLetras);
    }

    try {
        const pagoRealizado = creadorPago.crearPago();
        const factura = new Factura(
            Math.floor(Date.now() / 1000), 
            new Date(),
            carrito,
            pagoRealizado,
            tienda,
            cliente 
        );
        const detallesFactura = factura.obtenerDetalles();
        facturaResultadoPre.textContent = JSON.stringify(detallesFactura, null, 2);
        facturaContainer.style.display = 'block';

        const facturaOnlineData = `FacturaID:${factura.numero_factura}-Cliente:${cliente.id}-Total:${factura.total.toFixed(2)}`;
        facturaQrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(facturaOnlineData)}`;
        facturaQrDisplay.style.display = 'block'; 

    } catch (error) {
        alert(`Error al generar la factura: ${error.message}`);
        console.error(error);
    }
});


document.addEventListener('DOMContentLoaded', () => {
    console.log("--- Interfaz de Facturación Iniciada ---");
    renderizarProductos();
    renderizarCarrito();

    // NUEVO: Escuchar evento de productos actualizados para refrescar la lista
    window.addEventListener('productosActualizados', () => {
        console.log("Productos actualizados desde administración. Refrescando interfaz de facturación.");
        // Limpiar carrito si los productos se modificaron, para evitar inconsistencias
        carrito.items = []; 
        renderizarProductos();
        renderizarCarrito();
    });
});