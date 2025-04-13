using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using tecbank_api.Models.Clientes_Cuentas;
using tecbank_api.Models.Prestamos_Pagos;

namespace tecbank_api.Models
{
    public class Mora
    {
        [Key]
        public int id_mora { get; set; }
        public int cuotas_vencidas { get; set; }
        public double monto_adeudado { get; set; }

        public string? cedula { get; set; } 
        public string? nombre_completo { get; set; }

        // Foreign key de prestamo
        public int id_prestamo { get; set; }
        [JsonIgnore]
        public Prestamo? prestamo { get; set; }
    }
}
