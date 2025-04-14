using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using tecbank_api.Models.Clientes_Cuentas;

namespace tecbank_api.Models
{
    public class Tarjeta
    {
        [Key]
        public int numero_tarjeta { get; set; } // id
        public int cvc { get; set; }
        public DateOnly fecha_vencimiento { get; set; }
        public double? monto_disponible { get; set; }
        public double? monto_credito { get; set; }

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
