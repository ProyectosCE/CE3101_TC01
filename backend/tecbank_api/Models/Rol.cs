using System.Text.Json.Serialization;

namespace tecbank_api.Models
{
    public class Rol
    {
        public string id_rol { get; set; }
        public string descripcion { get; set; }

        [JsonIgnore]
        public List<Asesor> asesores { get; set; } = new();
    }
}
