using System.Text.Json.Serialization;

namespace tecbank_api.Models
{
    public class Tarjeta
    {
        public int numero_tarjeta { get; set; } // id
        public int cvc { get; set; }
        public DateTime fecha_vencimiento { get; set; }
        public double monto_disponible { get; set; }

        // Foreign key to Cliente
        public int id_cliente { get; set; }
        [JsonIgnore]
        public Cliente? cliente { get; set; }

        //Foreign key to Tipo_Tarjeta
        public string id_tipo_tarjeta { get; set; }
        [JsonIgnore]
        public Tipo_Tarjeta? tipo_tarjeta { get; set; }
    }
}
