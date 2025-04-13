using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace tecbank_api.Models
{
    public class Tipo_Tarjeta
    {
        [Key]
        public string tipo_tarjeta { get; set; } // ID 
        public string descripcion { get; set; }

        [JsonIgnore]
        public List<Tarjeta> tarjetas { get; set; } = new();
    }
}
