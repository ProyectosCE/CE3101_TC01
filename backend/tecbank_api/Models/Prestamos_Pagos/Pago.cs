using System.Text.Json.Serialization;

namespace tecbank_api.Models.Prestamos_Pagos
{
    public class Pago
    {
        public DateOnly fecha { get; set; }
        public double monto { get; set; }


        // Foreign key de prestamo
        public int id_prestamo { get; set; }
        [JsonIgnore]
        public Prestamo? prestamo { get; set; }

        // Foreign key de tipo_pago
        public string id_tipo_pago { get; set; }
        [JsonIgnore]
        public Tipo_Pago? tipo_pago { get; set; }
    }
}
