using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace tecbank_api.Models.Clientes_Cuentas
{
    /* 
    Class: Tipo_Transaccion
        Representa un tipo de transacción bancaria dentro del sistema (por ejemplo, depósito, retiro, transferencia).

    Attributes:
        - tipo_transaccion: string 
            Identificador único del tipo de transacción.
        - descripcion: string 
            Descripción textual del tipo de transacción.
        - transacciones: List<Transaccion> 
            Lista de transacciones que corresponden a este tipo. Se ignora en la serialización JSON.

    Constructor:
        - Tipo_Transaccion() 
            Constructor predeterminado que inicializa la lista de transacciones como vacía.

    Problems:
        No se han identificado problemas durante la implementación de esta clase.

    References:
        N/A
    */
    public class Tipo_Transaccion
    {
        [Key]
        public string tipo_transaccion { get; set; } // ID
        public string descripcion { get; set; }

        [JsonIgnore]
        public List<Transaccion> transacciones { get; set; } = new();
    }
}
