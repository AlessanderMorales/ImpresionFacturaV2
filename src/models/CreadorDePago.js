class CreadorDePago {
    constructor() {
        if (new.target === CreadorDePago) {
            throw new Error("La clase 'CreadorDePago' es abstracta y no puede ser instanciada directamente.");
        }
    }
    crearPago() {
        throw new Error("El método 'crearPago()' debe ser implementado por las subclases.");
    }
    realizarTransaccion() {
        const pago = this.crearPago();
        return pago.realizarPago();
    }
}
