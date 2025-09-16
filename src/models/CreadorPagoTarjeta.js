import { CreadorDePago } from './CreadorDePago.js';
import { PagoTarjeta } from './PagoTarjeta.js';

export class CreadorPagoTarjeta extends CreadorDePago {
    constructor(monto, montoEnLetras, numeroTarjeta) {
        super();
        CreadorPagoTarjeta.validarMonto(monto);
        CreadorPagoTarjeta.validarMontoEnLetras(montoEnLetras);
        CreadorPagoTarjeta.validarNumeroTarjeta(numeroTarjeta);

        this.monto = monto;
        this.montoEnLetras = montoEnLetras;
        this.numeroTarjeta = numeroTarjeta;
    }

    static validarMonto(monto) {
        if (typeof monto !== 'number' || monto <= 0) {
            throw new Error("Monto de pago con tarjeta inválido. Debe ser un número positivo.");
        }
    }

    static validarMontoEnLetras(montoEnLetras) {
        if (typeof montoEnLetras !== 'string' || montoEnLetras.trim() === '') {
            throw new Error("Monto en letras para pago con tarjeta inválido. Debe ser una cadena de texto no vacía.");
        }
    }

    static validarNumeroTarjeta(numeroTarjeta) {
        if (typeof numeroTarjeta !== 'string' || numeroTarjeta.trim() === '') {
            throw new Error("Número de tarjeta inválido. Debe ser una cadena de texto no vacía.");
        }
        if (!/^\d{13,19}$/.test(numeroTarjeta.replace(/\s/g, ''))) { 
            throw new Error("El número de tarjeta debe contener entre 13 y 19 dígitos.");
        }
        
    }

    crearPago() {
      
        return new PagoTarjeta(this.monto, this.montoEnLetras, this.numeroTarjeta);
    }
}