import { Pago } from './Pago.js';

export class PagoCash extends Pago {
    constructor(monto, montoEnLetras) {
        // Las validaciones para 'monto' y 'montoEnLetras'
        // son gestionadas por el constructor de la clase base 'Pago'.
        super(monto, montoEnLetras); 
    }

    // No se necesitan validaciones estáticas aquí para monto o montoEnLetras,
    // ya que el constructor de la clase base 'Pago' se encarga de eso.
    // Si hubieran propiedades específicas de PagoCash, se agregarían aquí.

    realizarPago() {
        console.log(`Procesando pago en efectivo por ${this.monto} (${this.montoEnLetras}).`);
        return `Pago en efectivo por ${this.monto} completado exitosamente.`;
    }
}