import { ItemVenta } from './src/models/ItemVenta.js';
import { Venta } from './src/models/Venta.js';
import { Factura } from './src/models/Factura.js';
import { CreadorDePagoCash } from './src/models/CreadorDePagoCash.js';
import { CreadorPagoTarjeta } from './src/models/CreadorPagoTarjeta.js';

import { ClienteService } from './src/services/ClienteService.js';
import { ProductoService } from './src/services/ProductoService.js';
import { TiendaService } from './src/services/TiendaService.js';


const carrito = new Venta();
let productosDisponibles = []; 

const productListDiv = document.getElementById('product-list');
const cartItemsDiv = document.getElementById('cart-items');
const cartTotalDiv = document.getElementById('cart-total');
const clienteInfoP = document.getElementById('cliente-info');
const btnGenerarFactura = document.getElementById('btn-generar-factura');
const facturaContainer = document.getElementById('factura-container');
const facturaResultadoPre = document.getElementById('factura-resultado');
const tarjetaInfoDiv = document.getElementById('tarjeta-info');

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
    const itemVenta = new ItemVenta(1, producto);
    carrito.agregarItem(itemVenta);
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
                    <span>${item.cantidad}x ${item.producto.nombre}</span>
                    <span>Bs. ${item.subtotal.toFixed(2)}</span>
                </div>
            `;
            cartItemsDiv.innerHTML += itemHTML;
        });
    }
    const total = carrito.calcularTotal();
    cartTotalDiv.textContent = `Total: Bs. ${total.toFixed(2)}`;
}

function cargarDatosIniciales() {
    const cliente = ClienteService.obtenerClientePorId("C001");
    if (cliente) {
        clienteInfoP.textContent = `Nombre: ${cliente.nombreYApellido} - NIT: ${cliente.nit}`;
    }
}

document.querySelectorAll('input[name="metodoPago"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        tarjetaInfoDiv.style.display = e.target.value === 'tarjeta' ? 'block' : 'none';
    });
});

btnGenerarFactura.addEventListener('click', () => {
    if (carrito.items.length === 0) {
        alert("El carrito está vacío. Agregue productos antes de generar la factura.");
        return;
    }

    const cliente = ClienteService.obtenerClientePorId("C001");
    const tienda = TiendaService.obtenerTiendaPorNombre("TecnoOutlet Central");
    const totalVenta = carrito.calcularTotal();

    const metodoPagoSeleccionado = document.querySelector('input[name="metodoPago"]:checked').value;
    let creadorPago;

    if (metodoPagoSeleccionado === 'tarjeta') {
        const numeroTarjeta = document.getElementById('numeroTarjeta').value;
        try {
            creadorPago = new CreadorPagoTarjeta(totalVenta, "Monto en letras (ejemplo)", numeroTarjeta);
        } catch (error) {
            alert(`Error: ${error.message}`);
            return;
        }
    } else { 
        creadorPago = new CreadorDePagoCash(totalVenta, "Monto en letras (ejemplo)");
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

    } catch (error) {
        alert(`Error al generar la factura: ${error.message}`);
        console.error(error);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    console.log("--- Interfaz de Facturación Iniciada ---");
    cargarDatosIniciales();
    renderizarProductos();
    renderizarCarrito();
});