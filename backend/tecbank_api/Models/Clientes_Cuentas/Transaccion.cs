using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace tecbank_api.Models.Clientes_Cuentas
{
    public class Transaccion
    {
        [Key]
        public int id_transaccion { get; set; } // ID
        public string estado { get; set; }
        public DateTime fecha_hora { get; set; }
        public string descripcion { get; set; }
        public double monto { get; set; }
        public string moneda { get; set; }

        public int? cuenta_destino { get; set; } // Para transferencias
        public int? numero_tarjeta { get; set; } // Para compras con tarjeta

        // Foreign key to Cuenta
        public int numero_cuenta { get; set; }
        [JsonIgnore]
        public Cuenta? cuenta { get; set; }

        // Foreign key to Tipo_Transaccion
        public string id_tipo_transaccion { get; set; }
        [JsonIgnore]
        public Tipo_Transaccion? tipo_transaccion { get; set; }
    }
}
