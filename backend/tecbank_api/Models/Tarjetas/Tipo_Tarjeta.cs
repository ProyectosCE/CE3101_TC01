using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace tecbank_api.Models
{
    /* 
    Class: Tipo_Tarjeta
        Representa los diferentes tipos de tarjetas que pueden ser emitidas, como tarjeta de débito o de crédito.

    Attributes:
        - tipo_tarjeta: string 
            Identificador único del tipo de tarjeta (por ejemplo, "DEBITO", "CREDITO").
        - descripcion: string 
            Descripción textual del tipo de tarjeta.
        - tarjetas: List<Tarjeta> 
            Lista de tarjetas asociadas a este tipo de tarjeta. Se ignora en la serialización JSON.

    Constructor:
        - Tipo_Tarjeta() 
            Constructor predeterminado que inicializa la lista de tarjetas como vacía.

    Problems:
        No se han identificado problemas durante la implementación de esta clase.

    References:
        N/A
    */
    public class Tipo_Tarjeta
    {
        [Key]
        public string tipo_tarjeta { get; set; } // ID 
        public string descripcion { get; set; }

        [JsonIgnore]
        public List<Tarjeta> tarjetas { get; set; } = new();
    }
}
