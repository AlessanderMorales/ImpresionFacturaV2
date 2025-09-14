import { Pago } from './Pago.js';

export class PagoQR extends Pago {
    constructor(monto, montoEnLetras, codigoQR = null) {
        super(monto, montoEnLetras);
        this.codigoQR = codigoQR || this.generarQR(); // Genera un QR si no se provee uno
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