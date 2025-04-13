using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace tecbank_api.Models.Clientes_Cuentas
{
    public class Moneda
    {
        [Key]
        public string moneda { get; set; } // ID

        [JsonIgnore]
        public List<Cuenta> cuentas { get; set; } = new();
    }
}
