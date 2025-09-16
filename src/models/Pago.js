export class Pago {
    constructor(monto, montoEnLetras) {
        Pago.validarInstanciacionAbstracta(new.target);
        Pago.validarMonto(monto);
        Pago.validarMontoEnLetras(montoEnLetras);

        this.monto = monto;
        this.montoEnLetras = montoEnLetras;
    }

    static validarInstanciacionAbstracta(target) {
        if (target === Pago) {
            throw new Error("La clase 'Pago' es abstracta y no puede ser instanciada directamente.");
        }
    }

    static validarMonto(monto) {
        if (typeof monto !== 'number' || monto <= 0) { 
            throw new Error("El monto del pago es inválido. Debe ser un número positivo.");
        }
    }

    static validarMontoEnLetras(montoEnLetras) {
        if (typeof montoEnLetras !== 'string' || montoEnLetras.trim() === '') {
            throw new Error("El monto en letras del pago es inválido. No puede estar vacío.");
        }
    }

    realizarPago() {
        Pago.validarImplementacionMetodo('realizarPago');
    }

    static validarImplementacionMetodo(nombreMetodo) {
        throw new Error(`El método '${nombreMetodo}()' debe ser implementado por las subclases de Pago.`);
    }
}