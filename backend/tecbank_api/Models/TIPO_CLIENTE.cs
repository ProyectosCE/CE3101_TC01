using System.Text.Json.Serialization;

namespace tecbank_api.Models
{
    public class Tipo_Cliente
    {
        public string tipo { get; set; }

        public string descripcion { get; set; }

        [JsonIgnore]
        public List<Cliente> clientes { get; set; } = new();
    }
}
