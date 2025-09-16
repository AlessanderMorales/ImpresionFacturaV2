import { CreadorDePago } from './CreadorDePago.js';
import { PagoQR } from './PagoQR.js';

export class CreadorPagoQR extends CreadorDePago {
    constructor(monto, monto_en_letras) {
        super();
        this.monto = monto;
        this.monto_en_letras = monto_en_letras;
    }

    crearPago() {
        return new PagoQR(this.monto, this.monto_en_letras);
    }
}