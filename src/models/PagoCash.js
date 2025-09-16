import { Pago } from './Pago.js';

export class PagoCash extends Pago {
    constructor(monto, monto_en_letras) {
        super(monto, monto_en_letras);
    }

    realizar_pago() {
        console.log(`Procesando pago en efectivo por ${this.monto} (${this.monto_en_letras}).`);
        return `Pago en efectivo por ${this.monto} completado exitosamente.`;
    }
}