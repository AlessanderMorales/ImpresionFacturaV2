export class CreadorDePago {
    constructor() {
        CreadorDePago.validarInstanciacionAbstracta(new.target);
    }

    static validarInstanciacionAbstracta(target) {
        if (target === CreadorDePago) {
            throw new Error("La clase 'CreadorDePago' es abstracta y no puede ser instanciada directamente.");
        }
    }

    crearPago() {
        CreadorDePago.validarImplementacionMetodo('crearPago');
    }

    realizarTransaccion() {
        const pago = this.crearPago();
        return pago.realizarPago();
    }

    static validarImplementacionMetodo(nombreMetodo) {
        throw new Error(`El método '${nombreMetodo}()' debe ser implementado por las subclases.`);
    }
}