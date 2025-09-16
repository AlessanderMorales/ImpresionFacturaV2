import { Cliente } from './src/models/Cliente.js';
import { ItemVenta } from './src/models/ItemVenta.js';
import { Venta } from './src/models/Venta.js';
import { Factura } from './src/models/Factura.js';
import { CreadorDePagoCash } from './src/models/CreadorDePagoCash.js';
import { CreadorPagoTarjeta } from './src/models/CreadorPagoTarjeta.js';
import { CreadorPagoQR } from './src/models/CreadorPagoQR.js'; 

import { ProductoService } from './src/services/ProductoService.js';
import { TiendaService } from './src/services/TiendaService.js';
import { FacturaService } from './src/services/FacturaService.js';

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

const clientPastInvoicesSection = document.getElementById('client-past-invoices-section');
const clientViewNitInput = document.getElementById('client-view-nit');
const btnViewClientInvoices = document.getElementById('btn-view-client-invoices');
const clientInvoicesResultDiv = document.getElementById('client-invoices-result');

function renderizarProductos() {
    productosDisponibles = ProductoService.obtenerTodosLosProductos();
    productListDiv.innerHTML = ''; 
    
    if (productosDisponibles.length === 0) {
        productListDiv.innerHTML = '<p>No hay productos disponibles.</p>';
        return;
    }

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
        itemExistente.subtotal = itemExistente.calcular_subtotal();
    } else {
        const itemVenta = new ItemVenta(1, producto);
        carrito.agregar_item(itemVenta);
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
    const total = carrito.calcular_total();
    cartTotalDiv.textContent = `Total: Bs. ${total.toFixed(2)}`;
}

document.querySelectorAll('input[name="metodoPago"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        tarjetaInfoDiv.style.display = 'none';
        qrInfoDiv.style.display = 'none'; 

        if (e.target.value === 'tarjeta') {
            tarjetaInfoDiv.style.display = 'block';
        } else if (e.target.value === 'qr') {
            const totalActual = carrito.calcular_total().toFixed(2);
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
        const clienteId = 'C-' + nitClienteNum;
        cliente = new Cliente(clienteId, nombreCliente, nitClienteNum);
    } catch (error) {
        alert(`Error en los datos del cliente: ${error.message}`);
        return;
    }

    const tienda = TiendaService.obtenerTiendaPorNombre("TecnoOutlet Central");
    if (!tienda) {
        alert("Error: No se pudieron cargar los datos de la tienda.");
        return;
    }

    const totalVenta = carrito.calcular_total();
    if (totalVenta <= 0) {
        alert("El total de la venta debe ser mayor a cero.");
        return;
    }

    const metodoPagoSeleccionado = document.querySelector('input[name="metodoPago"]:checked').value;
    let creadorPago;
    let montoEnLetras = "Monto en letras (ejemplo)";

    try {
        if (metodoPagoSeleccionado === 'tarjeta') {
            const numeroTarjeta = document.getElementById('numeroTarjeta').value;
            creadorPago = new CreadorPagoTarjeta(totalVenta, montoEnLetras, numeroTarjeta);
        } else if (metodoPagoSeleccionado === 'qr') { 
            creadorPago = new CreadorPagoQR(totalVenta, montoEnLetras);
        } else { 
            creadorPago = new CreadorDePagoCash(totalVenta, montoEnLetras);
        }
    
        const pagoRealizado = creadorPago.crearPago();
        
        const factura = new Factura(
            Math.floor(Date.now() / 1000),
            new Date(),
            carrito,
            pagoRealizado,
            tienda,
            cliente 
        );
        
        FacturaService.guardarFactura(factura);

        const detallesFactura = factura.obtenerDetalles();
        facturaResultadoPre.textContent = JSON.stringify(detallesFactura, null, 2);
        facturaContainer.style.display = 'block';

        const facturaOnlineData = `FacturaID:${factura.numero_factura}-Cliente:${cliente.id}-Total:${factura.total.toFixed(2)}`;
        facturaQrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(facturaOnlineData)}`;
        facturaQrDisplay.style.display = 'block'; 

        carrito.items = [];
        renderizarCarrito();
        alert('Factura generada y guardada exitosamente!');

    } catch (error) {
        alert(`Error al generar la factura: ${error.message}`);
        console.error(error);
    }
});

btnViewClientInvoices.addEventListener('click', () => {
    const clientNit = parseInt(clientViewNitInput.value.trim(), 10);

    if (isNaN(clientNit) || clientNit <= 0) {
        alert("Por favor, ingrese un NIT/CI válido para buscar sus facturas.");
        clientInvoicesResultDiv.innerHTML = '';
        return;
    }

    const facturasDelCliente = FacturaService.obtenerFacturasPorClienteNit(clientNit);
    
    clientInvoicesResultDiv.innerHTML = '';

    if (facturasDelCliente.length === 0) {
        clientInvoicesResultDiv.innerHTML = `<p>No se encontraron facturas para el NIT/CI ${clientNit}.</p>`;
    } else {
        const ul = document.createElement('ul');
        facturasDelCliente.forEach(factura => {
            const li = document.createElement('li');
            li.innerHTML = `
                <b>Factura #${factura.numero_factura}</b> - Fecha: ${new Date(factura.fecha).toLocaleDateString()} - Total: Bs. ${factura.total.toFixed(2)}
                <details>
                    <summary>Ver Detalles</summary>
                    <pre>${JSON.stringify(factura.obtenerDetalles(), null, 2)}</pre>
                </details>
            `;
            ul.appendChild(li);
        });
        clientInvoicesResultDiv.appendChild(ul);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    console.log("--- Interfaz de Facturación Iniciada ---");
    renderizarProductos();
    renderizarCarrito();

    window.addEventListener('productosActualizados', () => {
        console.log("Productos actualizados desde administración. Refrescando interfaz de facturación.");
        carrito.items = []; 
        renderizarProductos();
        renderizarCarrito();
    });
});