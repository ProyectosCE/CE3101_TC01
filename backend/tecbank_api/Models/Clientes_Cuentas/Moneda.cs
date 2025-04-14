using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace tecbank_api.Models.Clientes_Cuentas
{

    /* 
    Class: Moneda
        Representa una moneda utilizada en las cuentas del sistema bancario.

    Attributes:
        - moneda: string 
            Identificador de la moneda (por ejemplo, "COLON", "DOLAR", "EURO").
        - cuentas: List<Cuenta> 
            Lista de cuentas asociadas que utilizan esta moneda. Se ignora en la serialización JSON.

    Constructor:
        - Moneda() 
            Constructor predeterminado que inicializa la lista de cuentas como vacía.

    Problems:
        No se han identificado problemas durante la implementación de esta clase.

    References:
        N/A
    */
    public class Moneda
    {
        [Key]
        public string moneda { get; set; } // ID

        [JsonIgnore]
        public List<Cuenta> cuentas { get; set; } = new();
    }
}
