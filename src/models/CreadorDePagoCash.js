class CreadorPagoCash extends CreadorDePago {
    /**
     * @param {number} monto
     * @param {string} montoEnLetras
     */
    constructor(monto, montoEnLetras) {
        super();
        this.monto = monto;
        this.montoEnLetras = montoEnLetras;
    }
    crearPago() {
        return new PagoCash(this.monto, this.montoEnLetras);
    }
}