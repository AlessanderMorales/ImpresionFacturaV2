import { CreadorDePago } from './CreadorDePago.js';
import { PagoQR } from './PagoQR.js'; 

export class CreadorPagoQR extends CreadorDePago {
    constructor(monto, montoEnLetras) {
        super();
        CreadorPagoQR.validarMonto(monto);
        CreadorPagoQR.validarMontoEnLetras(montoEnLetras);

        this.monto = monto;
        this.montoEnLetras = montoEnLetras;
    }

    static validarMonto(monto) {
        if (typeof monto !== 'number' || monto <= 0) {
            throw new Error("Monto de pago QR inválido. Debe ser un número positivo.");
        }
    }

    static validarMontoEnLetras(montoEnLetras) {
        if (typeof montoEnLetras !== 'string' || montoEnLetras.trim() === '') {
            throw new Error("Monto en letras para pago QR inválido. Debe ser una cadena de texto no vacía.");
        }
    }

    crearPago() {
        return new PagoQR(this.monto, this.montoEnLetras);
    }
}