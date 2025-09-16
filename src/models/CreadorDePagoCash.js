import { CreadorDePago } from './CreadorDePago.js';
import { PagoCash } from './PagoCash.js'; // Asegúrate de que PagoCash tenga su propio sistema de validación si es necesario.

export class CreadorDePagoCash extends CreadorDePago {
    constructor(monto, montoEnLetras) {
        super();
        CreadorDePagoCash.validarMonto(monto);
        CreadorDePagoCash.validarMontoEnLetras(montoEnLetras);

        this.monto = monto;
        this.montoEnLetras = montoEnLetras;
    }

    static validarMonto(monto) {
        if (typeof monto !== 'number' || monto <= 0) {
            throw new Error("Monto de pago inválido. Debe ser un número positivo.");
        }
    }

    static validarMontoEnLetras(montoEnLetras) {
        if (typeof montoEnLetras !== 'string' || montoEnLetras.trim() === '') {
            throw new Error("Monto en letras inválido. Debe ser una cadena de texto no vacía.");
        }
    }

    crearPago() {
        return new PagoCash(this.monto, this.montoEnLetras);
    }
}