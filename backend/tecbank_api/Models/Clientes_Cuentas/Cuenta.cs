using System.Text.Json.Serialization;

namespace tecbank_api.Models.Clientes_Cuentas
{
    public class Cuenta
    {
        public int numero_cuenta { get; set; } // id
        public string descripcion { get; set; }
        public double monto { get; set; }

        // Foreign key to Cliente
        public int id_cliente { get; set; }
        [JsonIgnore]
        public Cliente? cliente { get; set; }

        // Foreign key to Tipo_Cuenta
        public string id_tipo_cuenta { get; set; }
        [JsonIgnore]
        public Tipo_Cuenta? tipo_cuenta { get; set; }

        // Foreign key to Moneda
        public string id_moneda { get; set; }
        [JsonIgnore]
        public Moneda? moneda { get; set; }

        [JsonIgnore]
        public List<Transaccion> transacciones { get; set; } = new();
    }
}
