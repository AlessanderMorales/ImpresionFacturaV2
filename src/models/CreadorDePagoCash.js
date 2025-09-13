class CreadorPagoCash extends CreadorDePago {
    constructor(monto, montoEnLetras) {
        super();
        this.monto = monto;
        this.montoEnLetras = montoEnLetras;
    }
    crearPago() {
        return new PagoCash(this.monto, this.montoEnLetras);
    }
}