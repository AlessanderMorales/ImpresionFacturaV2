import { CreadorDePago } from './CreadorDePago.js';
import { PagoCash } from './PagoCash.js';

export class CreadorDePagoCash extends CreadorDePago {
    constructor(monto, monto_en_letras) {
        super();
        this.monto = monto;
        this.monto_en_letras = monto_en_letras;
    }
    
    crearPago() {
        return new PagoCash(this.monto, this.monto_en_letras);
    }
}