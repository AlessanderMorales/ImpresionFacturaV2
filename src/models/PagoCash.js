import { Pago } from './Pago.js';
export class PagoCash extends Pago {
    constructor(monto, montoEnLetras) {
        super(monto, montoEnLetras);
    }
    realizarPago() {
        console.log(`Procesando pago en efectivo por ${this.monto} (${this.montoEnLetras}).`);
        return `Pago en efectivo por ${this.monto} completado exitosamente.`;
    }
}