export class Pago {
    constructor(monto, monto_en_letras) {
        if (new.target === Pago) {
            throw new Error("La clase 'Pago' es abstracta y no puede ser instanciada directamente.");
        }
        
        Pago.validarMonto(monto);
        Pago.validarMontoEnLetras(monto_en_letras);

        this.monto = monto;
        this.monto_en_letras = monto_en_letras;
    }

    static validarMonto(monto) {
        if (typeof monto !== 'number' || monto <= 0) { 
            throw new Error("El monto del pago es inválido. Debe ser un número positivo.");
        }
    }

    static validarMontoEnLetras(monto_en_letras) {
        if (typeof monto_en_letras !== 'string' || monto_en_letras.trim() === '') {
            throw new Error("El monto en letras del pago es inválido. No puede estar vacío.");
        }
    }

    realizar_pago() {
        throw new Error("El método 'realizar_pago()' debe ser implementado por las subclases de Pago.");
    }
}