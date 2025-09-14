import { CreadorDePago } from './CreadorDePago.js';
import { PagoQR } from './PagoQR.js';

export class CreadorPagoQR extends CreadorDePago {
    constructor(monto, montoEnLetras) {
        super();
        this.monto = monto;
        this.montoEnLetras = montoEnLetras;
    }

    crearPago() {
        return new PagoQR(this.monto, this.montoEnLetras);
    }
}