import { Pago } from './Pago.js';

export class PagoTarjeta extends Pago {

    constructor(monto, montoEnLetras, numeroTarjeta) {
        super(monto, montoEnLetras);
        if (typeof numeroTarjeta !== 'string' || !/^\d{13,19}$/.test(numeroTarjeta.replace(/\s/g, ''))) {
            throw new Error("El número de tarjeta no es válido.");
        }
        this.numeroTarjeta = numeroTarjeta;
    }
    realizarPago() {
        const ultimosCuatroDigitos = this.numeroTarjeta.slice(-4);
        console.log(`Procesando pago con tarjeta (**** **** **** ${ultimosCuatroDigitos}) por ${this.monto} (${this.montoEnLetras}).`);
        return `Pago con tarjeta por ${this.monto} completado exitosamente.`;
    }
}