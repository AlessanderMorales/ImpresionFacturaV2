import { Cliente } from './src/models/Cliente.js';
import { ItemVenta } from './src/models/ItemVenta.js';
import { Venta } from './src/models/Venta.js';
import { Factura } from './src/models/Factura.js';
import { CreadorDePagoCash } from './src/models/CreadorDePagoCash.js';
import { CreadorPagoTarjeta } from './src/models/CreadorPagoTarjeta.js';
import { CreadorPagoQR } from './src/models/CreadorPagoQR.js'; // Importa la nueva clase

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
const qrInfoDiv = document.getElementById('qr-info'); // Nuevo: div para info del QR
const qrImage = document.getElementById('qr-image');   // Nuevo: imagen del QR

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



document.querySelectorAll('input[name="metodoPago"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        tarjetaInfoDiv.style.display = 'none';
        qrInfoDiv.style.display = 'none'; // Ocultar QR por defecto

        if (e.target.value === 'tarjeta') {
            tarjetaInfoDiv.style.display = 'block';
        } else if (e.target.value === 'qr') {
            // Generar un QR ficticio para la demostración
            // En un escenario real, esto sería una llamada a un servicio
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

    const tienda = TiendaService.obtenerTiendaPorNombre("TecnoOutlet Central");
    const totalVenta = carrito.calcularTotal();

    const metodoPagoSeleccionado = document.querySelector('input[name="metodoPago"]:checked').value;
    let creadorPago;
    let montoEnLetras = "Monto en letras (ejemplo)"; // Podrías implementar una conversión a letras aquí

    if (metodoPagoSeleccionado === 'tarjeta') {
        const numeroTarjeta = document.getElementById('numeroTarjeta').value;
        try {
            creadorPago = new CreadorPagoTarjeta(totalVenta, montoEnLetras, numeroTarjeta);
        } catch (error) {
            alert(`Error: ${error.message}`);
            return;
        }
    } else if (metodoPagoSeleccionado === 'qr') { // Nuevo: Lógica para QR
        creadorPago = new CreadorPagoQR(totalVenta, montoEnLetras);
    }
    else { // Pago en efectivo por defecto
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
    } catch (error) {
        alert(`Error al generar la factura: ${error.message}`);
        console.error(error);
    }
});


document.addEventListener('DOMContentLoaded', () => {
    console.log("--- Interfaz de Facturación Iniciada ---");
    renderizarProductos();
    renderizarCarrito();
});