using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using tecbank_api.Models.Clientes_Cuentas;
using tecbank_api.Models.Prestamos_Pagos;

namespace tecbank_api.Models
{
    /* 
    Class: Mora
        Representa una mora asociada a un préstamo en el sistema bancario. Contiene información sobre el atraso en pagos.

    Attributes:
        - id_mora: int 
            Identificador único de la mora.
        - cuotas_vencidas: int 
            Cantidad de cuotas que el cliente no ha pagado.
        - monto_adeudado: double 
            Monto total adeudado asociado a la mora.
        - cedula: string? 
            Cédula del cliente relacionado a la mora (solo con fines informativos).
        - nombre_completo: string? 
            Nombre completo del cliente relacionado a la mora (solo con fines informativos).
        - id_prestamo: int 
            Clave foránea que hace referencia al préstamo asociado a la mora.
        - prestamo: Prestamo? 
            Objeto del préstamo relacionado. Se ignora en la serialización JSON.

    Constructor:
        - Mora() 
            Constructor predeterminado.

    Problems:
        No se han identificado problemas durante la implementación de esta clase.

    References:
        N/A
    */
    public class Mora
    {
        [Key]
        public int id_mora { get; set; }
        public int cuotas_vencidas { get; set; }
        public double monto_adeudado { get; set; }

        public string? cedula { get; set; } 
        public string? nombre_completo { get; set; }

        // Foreign key de prestamo
        public int id_prestamo { get; set; }
        [JsonIgnore]
        public Prestamo? prestamo { get; set; }
    }
}
