import { CreadorDePago } from './CreadorDePago.js';
import { PagoTarjeta } from './PagoTarjeta.js';
export class CreadorPagoTarjeta extends CreadorDePago {
    constructor(monto, montoEnLetras, numeroTarjeta) {
        super();
        this.monto = monto;
        this.montoEnLetras = montoEnLetras;
        this.numeroTarjeta = numeroTarjeta;
    }
    crearPago() {
        return new PagoTarjeta(this.monto, this.montoEnLetras, this.numeroTarjeta);
    }
}