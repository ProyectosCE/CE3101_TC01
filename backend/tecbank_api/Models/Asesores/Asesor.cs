using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using tecbank_api.Models.Prestamos_Pagos;

namespace tecbank_api.Models.Asesores
{
    public class Asesor
    {
        [Key]
        public int id_asesor { get; set; }
        public string nombre { get; set; }
        public string cedula { get; set; }
        public DateTime fecha_nacimiento { get; set; }
        public double monto_meta { get; set; }

        // Foreign key to Rol
        public string id_rol { get; set; }
        [JsonIgnore]
        public Rol? rol { get; set; }

        [JsonIgnore]
        public List<Prestamo> prestamos { get; set; } = new();

    }
}
