using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace tecbank_api.Models.Clientes_Cuentas
{
    /* 
    Class: Transaccion
        Representa una transacción realizada por un cliente en el sistema bancario.

    Attributes:
        - id_transaccion: int 
            Identificador único de la transacción.
        - estado: string 
            Estado de la transacción (por ejemplo, "completado", "pendiente").
        - fecha_hora: DateTime 
            Fecha y hora en que se realizó la transacción.
        - descripcion: string 
            Descripción de la transacción.
        - monto: double 
            Monto involucrado en la transacción.
        - moneda: string 
            Moneda utilizada en la transacción.
        - cuenta_destino: int? 
            Número de cuenta destino, aplicable en transferencias. Puede ser nulo.
        - numero_tarjeta: int? 
            Número de tarjeta utilizado, aplicable en compras con tarjeta. Puede ser nulo.
        - numero_cuenta: int 
            Clave foránea que hace referencia a la cuenta origen de la transacción.
        - cuenta: Cuenta? 
            Objeto cuenta asociado a la transacción. Se ignora en la serialización JSON.
        - id_tipo_transaccion: string 
            Clave foránea que indica el tipo de transacción (depósito, retiro, transferencia, etc.).
        - tipo_transaccion: Tipo_Transaccion? 
            Objeto del tipo de transacción asociado. Se ignora en la serialización JSON.

    Constructor:
        - Transaccion() 
            Constructor predeterminado.

    Problems:
        No se han identificado problemas durante la implementación de esta clase.

    References:
        N/A
    */

    public class Transaccion
    {
        [Key]
        public int id_transaccion { get; set; } // ID
        public string estado { get; set; }
        public DateTime fecha_hora { get; set; }
        public string descripcion { get; set; }
        public double monto { get; set; }
        public string moneda { get; set; }

        public int? cuenta_destino { get; set; } // Para transferencias
        public int? numero_tarjeta { get; set; } // Para compras con tarjeta

        // Foreign key to Cuenta
        public int numero_cuenta { get; set; }
        [JsonIgnore]
        public Cuenta? cuenta { get; set; }

        // Foreign key to Tipo_Transaccion
        public string id_tipo_transaccion { get; set; }
        [JsonIgnore]
        public Tipo_Transaccion? tipo_transaccion { get; set; }
    }
}
