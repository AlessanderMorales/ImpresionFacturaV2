import { Pago } from './Pago.js';

export class PagoQR extends Pago {
    constructor(monto, montoEnLetras, codigoQR = null) {
        super(monto, montoEnLetras); 

        
        if (codigoQR !== null && codigoQR !== undefined) {
            PagoQR.validarCodigoQR(codigoQR);
        }
        
        this.codigoQR = codigoQR || this.generarQR();
    }

    static validarCodigoQR(codigoQR) {
        if (typeof codigoQR !== 'string' || codigoQR.trim() === '') {
            throw new Error("Código QR inválido. Debe ser una cadena de texto no vacía si se proporciona.");
        }
      
    }

    generarQR() {
        return `QR-Monto-${this.monto}-Ref-${Date.now()}`;
    }

    realizarPago() {
        console.log(`Procesando pago QR por ${this.monto} (${this.montoEnLetras}).`);
        console.log(`Código QR para escaneo: ${this.codigoQR}`);
        return `Pago QR por ${this.monto} completado exitosamente con código: ${this.codigoQR}`;
    }
}