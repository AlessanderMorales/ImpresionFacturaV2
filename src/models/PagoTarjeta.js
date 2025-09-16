import { Pago } from './Pago.js';

export class PagoTarjeta extends Pago {
    constructor(monto, monto_en_letras, numero_tarjeta) {
        super(monto, monto_en_letras); 
        
        PagoTarjeta.validarNumeroTarjeta(numero_tarjeta);
        this.numero_tarjeta = numero_tarjeta;
    }

    static validarNumeroTarjeta(numero_tarjeta) {
        if (typeof numero_tarjeta !== 'string' || numero_tarjeta.trim() === '') {
            throw new Error("Número de tarjeta inválido. Debe ser una cadena de texto no vacía.");
        }
        
        if (!/^\d{13,19}$/.test(numero_tarjeta.replace(/\s/g, ''))) { 
            throw new Error("El número de tarjeta debe contener entre 13 y 19 dígitos numéricos.");
        }
    }

    realizar_pago() {
        const ultimosCuatroDigitos = this.numero_tarjeta.slice(-4);
        console.log(`Procesando pago con tarjeta (**** **** **** ${ultimosCuatroDigitos}) por ${this.monto} (${this.monto_en_letras}).`);
        return `Pago con tarjeta por ${this.monto} completado exitosamente.`;
    }
}