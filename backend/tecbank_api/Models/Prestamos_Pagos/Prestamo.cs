using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using tecbank_api.Models.Asesores;
using tecbank_api.Models.Clientes_Cuentas;

namespace tecbank_api.Models.Prestamos_Pagos
{
    public class Prestamo
    {
        [Key]
        public int id_prestamo { get; set; }
        public double tasa_interes { get; set; }
        public DateOnly fecha_inicio { get; set; }
        public DateOnly fecha_final { get; set; }
        public double monto_original { get; set; }
        public double saldo { get; set; }

        // Foreign key to Cliente
        public int id_cliente { get; set; }
        [JsonIgnore]
        public Cliente? cliente { get; set; }

        // Foreign key to Asesor
        public int id_asesor { get; set; }
        [JsonIgnore]
        public Asesor? asesor { get; set; }



        [JsonIgnore]
        public List<Mora> moras { get; set; } = new();

        [JsonIgnore]
        public List<Pago> pagos { get; set; } = new();

    }
}
