import { datosClientes } from '../data/clientes.js';
import { Cliente } from '../models/Cliente.js';

export class ClienteService {
    static obtenerClientePorId(id) {
        const clienteData = datosClientes.find(c => c.id === id);
        return clienteData ? new Cliente(clienteData.id, clienteData.nombreYApellido, clienteData.nit) : undefined;
    }
}