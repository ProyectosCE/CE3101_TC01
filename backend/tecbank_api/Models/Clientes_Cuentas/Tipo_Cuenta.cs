using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace tecbank_api.Models.Clientes_Cuentas
{
    /* 
    Class: Tipo_Cuenta
        Representa un tipo de cuenta bancaria dentro del sistema (por ejemplo, cuenta corriente, cuenta de ahorro).

    Attributes:
        - tipo_cuenta: string 
            Identificador único del tipo de cuenta).
        - descripcion: string 
            Descripción del tipo de cuenta.
        - cuentas: List<Cuenta> 
            Lista de cuentas que están clasificadas bajo este tipo. Se ignora en la serialización JSON.

    Constructor:
        - Tipo_Cuenta() 
            Constructor predeterminado que inicializa la lista de cuentas como vacía.

    Problems:
        No se han identificado problemas durante la implementación de esta clase.

    References:
        N/A
    */
    public class Tipo_Cuenta
    {
        [Key]
        public string tipo_cuenta { get; set; } // ID
        public string descripcion { get; set; }


        [JsonIgnore]
        public List<Cuenta> cuentas { get; set; } = new();
    }
}
