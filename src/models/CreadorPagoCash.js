import { CreadorDePago } from './CreadorDePago.js';
import { PagoCash } from './PagoCash.js';
import { CreadorPagoCash } from './src/models/CreadorPagoCash.js';
export class CreadorPagoCash extends CreadorDePago {
    constructor(monto, montoEnLetras) {
        super();
        this.monto = monto;
        this.montoEnLetras = montoEnLetras;
    }
    crearPago() {
        return new PagoCash(this.monto, this.montoEnLetras);
    }
}