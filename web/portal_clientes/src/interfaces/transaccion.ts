export interface Transaccion {
  id_transaccion: number;
  estado: string;
  fecha_hora: string;
  descripcion: string;
  monto: number;
  moneda: string;
  cuenta_destino: string | null;
  numero_tarjeta: string | null;
  numero_cuenta: number;
  id_tipo_transaccion: string;
}
