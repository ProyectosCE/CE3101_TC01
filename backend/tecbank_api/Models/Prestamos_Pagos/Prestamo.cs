using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using tecbank_api.Models.Asesores;
using tecbank_api.Models.Clientes_Cuentas;

namespace tecbank_api.Models.Prestamos_Pagos
{
    /* 
    Class: Prestamo
        Representa un préstamo solicitado por un cliente. Contiene detalles sobre el préstamo, pagos, moras, y el asesor asignado.

    Attributes:
        - id_prestamo: int 
            Identificador único del préstamo.
        - tasa_interes: double 
            Tasa de interés aplicada al préstamo.
        - fecha_inicio: DateOnly 
            Fecha de inicio del préstamo.
        - fecha_final: DateOnly 
            Fecha de vencimiento o finalización del préstamo.
        - monto_original: double 
            Monto original solicitado en el préstamo.
        - saldo: double 
            Saldo restante por pagar en el préstamo.
        - cedula: string 
            Cédula del cliente que solicitó el préstamo.
        - cliente: Cliente? 
            Objeto cliente relacionado al préstamo. Se ignora en la serialización JSON.
        - id_asesor: int 
            Clave foránea que hace referencia al asesor encargado del préstamo.
        - asesor: Asesor? 
            Objeto asesor relacionado con el préstamo. Se ignora en la serialización JSON.
        - moras: List<Mora> 
            Lista de moras asociadas al préstamo. Se ignora en la serialización JSON.
        - pagos: List<Pago> 
            Lista de pagos realizados al préstamo. Se ignora en la serialización JSON.

    Constructor:
        - Prestamo() 
            Constructor predeterminado que inicializa las listas de moras y pagos como vacías.

    Problems:
        No se han identificado problemas durante la implementación de esta clase.

    References:
        N/A
    */
    public class Prestamo
    {
        [Key]
        public int id_prestamo { get; set; }
        public double tasa_interes { get; set; }
        public DateOnly fecha_inicio { get; set; }
        public DateOnly fecha_final { get; set; }
        public double monto_original { get; set; }
        public double saldo { get; set; }
        public string estado { get; set; } = "Pendiente";

        // Reemplazar id_cliente por cedula
        public string cedula { get; set; }
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
