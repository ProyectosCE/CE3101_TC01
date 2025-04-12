using System.Text.Json.Serialization;

namespace tecbank_api.Models.Clientes_Cuentas
{
    public class Tipo_Cuenta
    {
        public string tipo_cuenta { get; set; } // ID
        public string descripcion { get; set; }
        [JsonIgnore]
        public List<Cuenta> cuentas { get; set; } = new();
    }
}
