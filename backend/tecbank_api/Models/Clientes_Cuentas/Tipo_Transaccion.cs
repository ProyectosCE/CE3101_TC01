using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace tecbank_api.Models.Clientes_Cuentas
{
    public class Tipo_Transaccion
    {
        [Key]
        public string tipo_transaccion { get; set; } // ID
        public string descripcion { get; set; }

        [JsonIgnore]
        public List<Transaccion> transacciones { get; set; } = new();
    }
}
