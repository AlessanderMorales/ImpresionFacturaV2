import { CreadorDePago } from './CreadorDePago.js';
import { PagoTarjeta } from './PagoTarjeta.js';

export class CreadorPagoTarjeta extends CreadorDePago {
    constructor(monto, monto_en_letras, numero_tarjeta) {
        super();
        this.monto = monto;
        this.monto_en_letras = monto_en_letras;
        this.numero_tarjeta = numero_tarjeta;
    }

    crearPago() {
        return new PagoTarjeta(this.monto, this.monto_en_letras, this.numero_tarjeta);
    }
}