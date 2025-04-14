export interface Cuenta {
  numero_cuenta: number;
  descripcion: string;
  monto: number;
  cedula: string;
  id_tipo_cuenta: string;
  id_moneda: string;
  tipo: string | null;
}

export interface ICuenta {
  numero_cuenta: number;
  descripcion: string;
  monto: number;
  cedula: string;
  id_tipo_cuenta: string;
  id_moneda: string;
  tipo: string | null;
}
