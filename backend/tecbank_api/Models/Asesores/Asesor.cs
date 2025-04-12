using System.Text.Json.Serialization;

namespace tecbank_api.Models.Asesores
{
    public class Asesor
    {
        public int id_asesor { get; set; }
        public string nombre { get; set; }
        public string cedula { get; set; }
        public DateTime fecha_nacimiento { get; set; }
        public double monto_meta { get; set; }

        // Foreign key to Rol
        public string id_rol { get; set; }
        [JsonIgnore]
        public Rol? rol { get; set; }

    }
}
