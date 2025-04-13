using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace tecbank_api.Models.Asesores
{
    public class Rol
    {
        [Key]
        public string id_rol { get; set; }
        public string descripcion { get; set; }

        [JsonIgnore]
        public List<Asesor> asesores { get; set; } = new();
    }
}
