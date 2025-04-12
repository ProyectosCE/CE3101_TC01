using System.Text.Json.Serialization;

namespace tecbank_api.Models
{
    public class Mora
    {
        public int id_mora { get; set; }
        public int cuotas_vencidas { get; set; }
        public double monto_adeudado { get; set; }

        // public string cedula { get; set; } 

        // Foreign key de prestamo
        public int id_prestamo { get; set; }
        [JsonIgnore]
        public Prestamo? prestamo { get; set; }
    }
}
