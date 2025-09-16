import { Pago } from './Pago.js';

export class PagoTarjeta extends Pago {
    constructor(monto, montoEnLetras, numeroTarjeta) {
        super(monto, montoEnLetras); 
        
        PagoTarjeta.validarNumeroTarjeta(numeroTarjeta);
        this.numeroTarjeta = numeroTarjeta;
    }

    static validarNumeroTarjeta(numeroTarjeta) {
        if (typeof numeroTarjeta !== 'string' || numeroTarjeta.trim() === '') {
            throw new Error("Número de tarjeta inválido. Debe ser una cadena de texto no vacía.");
        }
        
        if (!/^\d{13,19}$/.test(numeroTarjeta.replace(/\s/g, ''))) { 
            throw new Error("El número de tarjeta debe contener entre 13 y 19 dígitos numéricos.");
        }
        
    }

    realizarPago() {
        const ultimosCuatroDigitos = this.numeroTarjeta.slice(-4);
        console.log(`Procesando pago con tarjeta (**** **** **** ${ultimosCuatroDigitos}) por ${this.monto} (${this.montoEnLetras}).`);
        return `Pago con tarjeta por ${this.monto} completado exitosamente.`;
    }
}