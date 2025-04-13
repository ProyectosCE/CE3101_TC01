using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace tecbank_api.Models.Prestamos_Pagos
{
    public class Tipo_Pago
    {
        [Key]
        public string tipo_pago { get; set; }
        public string descripcion { get; set; }

        [JsonIgnore]
        public List<Pago> pagos { get; set; } = new();
    }
}
