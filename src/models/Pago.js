export class Pago {
    constructor(monto, montoEnLetras) {
        if (new.target === Pago) {
            throw new Error("La clase 'Pago' es abstracta y no puede ser instanciada directamente.");
        }
        if (typeof monto !== 'number' || monto < 0) {
            throw new Error("El monto debe ser un número positivo.");
        }
        if (typeof montoEnLetras !== 'string' || montoEnLetras.trim() === '') {
            throw new Error("El monto en letras no puede estar vacío.");
        }
        this.monto = monto;
        this.montoEnLetras = montoEnLetras;
    }
    realizarPago() {
        throw new Error("El método 'realizarPago()' debe ser implementado por las subclases.");
    }
}