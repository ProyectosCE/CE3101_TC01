using System.Text.Json.Serialization;
using tecbank_api.Models.Prestamos_Pagos;

namespace tecbank_api.Models.Clientes_Cuentas
{

    /* Class: Cliente
        Representa a un cliente en el sistema con sus detalles personales y de contacto.

    Attributes:
        - id_cliente: int - Identificador único del cliente.
        - cedula: string - Cédula de identidad del cliente.
        - direccion: string - Dirección física del cliente.
        - telefono: string - Número de teléfono del cliente.
        - ingreso_mensual: double - Ingreso mensual del cliente.
        - usuario: string - Nombre de usuario del cliente.
        - password: string - Contraseña del cliente.
        - nombre: string - Primer nombre del cliente.
        - apellido1: string - Primer apellido del cliente.
        - apellido2: string - Segundo apellido del cliente.
        - tipo_id: string - Identificador del tipo de cliente (clave foránea).
        - tipo_cliente: Tipo_Cliente? - Tipo de cliente asociado (opcional).

    Constructor:
        - Cliente: Constructor predeterminado de la clase Cliente. No recibe parámetros y asigna valores por defecto.

    Methods:
        - nombre_completo: Devuelve el nombre completo del cliente concatenando su nombre y apellidos. 
        Tipo: string
        Descripción: Retorna el nombre completo del cliente en formato "Nombre Apellido1 Apellido2".

    Problems:
        Ningún problema conocido durante la implementación de esta clase.

    References:
        N/A
    */

    public class Cliente
    {
        public int id_cliente { get; set; }
        public string cedula { get; set; }
        public string direccion { get; set; }
        public string telefono { get; set; }
        public double ingreso_mensual { get; set; }
        public string usuario { get; set; }
        public string password { get; set; }

        public string nombre { get; set; }
        public string apellido1 { get; set; }
        public string apellido2 { get; set; }
        public string nombre_completo => $"{nombre} {apellido1} {apellido2}".Trim();

        // Foreign key to Tipo_Cliente
        public string tipo_id { get; set; }
        [JsonIgnore]
        public Tipo_Cliente? tipo_cliente { get; set;}


        [JsonIgnore]
        public List<Prestamo> prestamos { get; set; } = new();

        [JsonIgnore]
        public List<Tarjeta> tarjetas { get; set; } = new();

        [JsonIgnore]
        public List<Cuenta> cuentas { get; set; } = new();
    }
}
