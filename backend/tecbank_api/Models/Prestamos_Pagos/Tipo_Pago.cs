using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace tecbank_api.Models.Prestamos_Pagos
{
    /* 
    Class: Tipo_Pago
        Representa un tipo de pago asociado a los préstamos. Los tipos de pago pueden incluir "CUOTA", "EXTRA", etc.

    Attributes:
        - tipo_pago: string 
            Identificador único del tipo de pago (por ejemplo, "CUOTA", "EXTRA").
        - descripcion: string 
            Descripción textual del tipo de pago.
        - pagos: List<Pago> 
            Lista de pagos asociados a este tipo de pago. Se ignora en la serialización JSON.

    Constructor:
        - Tipo_Pago() 
            Constructor predeterminado que inicializa la lista de pagos como vacía.

    Problems:
        No se han identificado problemas durante la implementación de esta clase.

    References:
        N/A
    */
    public class Tipo_Pago
    {
        [Key]
        public string tipo_pago { get; set; }
        public string descripcion { get; set; }

        [JsonIgnore]
        public List<Pago> pagos { get; set; } = new();
    }
}
