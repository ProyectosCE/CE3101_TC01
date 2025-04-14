using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace tecbank_api.Models.Clientes_Cuentas
{
    /* 
    Class: Cuenta
        Representa una cuenta bancaria asociada a un cliente dentro del sistema.

    Attributes:
        - numero_cuenta: int 
            Identificador único de la cuenta (número de cuenta).
        - descripcion: string 
            Descripción o nombre personalizado para la cuenta.
        - monto: double 
            Monto actual disponible en la cuenta.
        - cedula: string 
            Cédula del cliente propietario de la cuenta.
        - cliente: Cliente? 
            Objeto cliente asociado a esta cuenta. Se ignora en la serialización JSON.
        - id_tipo_cuenta: string 
            Clave foránea que indica el tipo de cuenta (ej. ahorro, corriente).
        - tipo_cuenta: Tipo_Cuenta? 
            Objeto del tipo de cuenta asociado. Se ignora en la serialización JSON.
        - id_moneda: string 
            Clave foránea que indica la moneda asociada a la cuenta (ej. COLON, DOLAR).
        - moneda: Moneda? 
            Objeto moneda asociado a la cuenta. Se ignora en la serialización JSON.
        - transacciones: List<Transaccion> 
            Lista de transacciones asociadas a esta cuenta. Se ignora en la serialización JSON.
        - tipo: string 
            Tipo de cuenta (e.g., "AHORROS", "CORRIENTE", "TCREDITO").

    Constructor:
        - Cuenta() 
            Constructor predeterminado que inicializa la lista de transacciones como vacía.

    Problems:
        No se han identificado problemas durante la implementación de esta clase.

    References:
        N/A
    */
    public class Cuenta
    {
        [Key]
        public int numero_cuenta { get; set; } // id
        public string descripcion { get; set; }
        public double monto { get; set; }

        // Reemplazar id_cliente por cedula
        public string cedula { get; set; }
        [JsonIgnore]
        public Cliente? cliente { get; set; }

        // Foreign key to Tipo_Cuenta
        public string id_tipo_cuenta { get; set; }
        [JsonIgnore]
        public Tipo_Cuenta? tipo_cuenta { get; set; }

        // Foreign key to Moneda
        public string id_moneda { get; set; }
        [JsonIgnore]
        public Moneda? moneda { get; set; }

        [JsonIgnore]
        public List<Transaccion> transacciones { get; set; } = new();

        public string tipo { get; set; } // Tipo de cuenta (e.g., "AHORROS", "CORRIENTE", "TCREDITO")
    }
}
