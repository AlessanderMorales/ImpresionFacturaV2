import { Pago } from './Pago.js';

export class PagoQR extends Pago {
    constructor(monto, monto_en_letras, codigoQR = null) {
        super(monto, monto_en_letras); 

        if (codigoQR) {
            PagoQR.validarCodigoQR(codigoQR);
        }
        
        this.codigoQR = codigoQR || this.generar_QR();
    }

    static validarCodigoQR(codigoQR) {
        if (typeof codigoQR !== 'string' || codigoQR.trim() === '') {
            throw new Error("Código QR inválido. Debe ser una cadena de texto no vacía si se proporciona.");
        }
    }

    generar_QR() {
        return `QR-Monto-${this.monto}-Ref-${Date.now()}`;
    }

    realizar_pago() {
        console.log(`Procesando pago QR por ${this.monto} (${this.monto_en_letras}).`);
        console.log(`Código QR para escaneo: ${this.codigoQR}`);
        return `Pago QR por ${this.monto} completado exitosamente con código: ${this.codigoQR}`;
    }
}