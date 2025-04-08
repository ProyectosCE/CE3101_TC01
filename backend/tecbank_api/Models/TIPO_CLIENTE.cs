using System.Text.Json.Serialization;

namespace tecbank_api.Models
{
/* Class: Tipo_Cliente
    Representa el tipo de cliente en el sistema, con su descripción y la lista de clientes asociados.

 Attributes:
- tipo: string - Tipo de cliente (por ejemplo, "FISICO", "JURIDICO").
- descripcion: string - Descripción detallada del tipo de cliente.
- clientes: List<Cliente> - Lista de clientes asociados a este tipo de cliente. Este atributo es ignorado durante la serialización JSON.

 Constructor:
- Tipo_Cliente: Constructor predeterminado de la clase Tipo_Cliente. No recibe parámetros y asigna valores por defecto.

 Methods:
 - N/A

 Problems:
  Ningún problema conocido durante la implementación de esta clase.

 References:
  N/A
*/

    public class Tipo_Cliente
    {
        public string tipo { get; set; }

        public string descripcion { get; set; }

        [JsonIgnore]
        public List<Cliente> clientes { get; set; } = new();
    }
}
