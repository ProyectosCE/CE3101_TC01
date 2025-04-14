using System.Text.Json.Serialization;

namespace tecbank_api.Models.Prestamos_Pagos
{
    /* 
    Class: Pago
        Representa un pago realizado por un cliente para amortizar un préstamo.

    Attributes:
        - fecha: DateOnly 
            Fecha en que se realizó el pago.
        - monto: double 
            Monto del pago realizado.
        - id_prestamo: int 
            Clave foránea que hace referencia al préstamo asociado al pago.
        - prestamo: Prestamo? 
            Objeto del préstamo asociado al pago. Se ignora en la serialización JSON.
        - id_tipo_pago: string 
            Clave foránea que indica el tipo de pago (por ejemplo, "CUOTA", "EXTRA").
        - tipo_pago: Tipo_Pago? 
            Objeto del tipo de pago asociado. Se ignora en la serialización JSON.

    Constructor:
        - Pago() 
            Constructor predeterminado.

    Problems:
        No se han identificado problemas durante la implementación de esta clase.

    References:
        N/A
    */
    public class Pago
    {
        public DateOnly fecha { get; set; }
        public double monto { get; set; }


        // Foreign key de prestamo
        public int id_prestamo { get; set; }
        [JsonIgnore]
        public Prestamo? prestamo { get; set; }

        // Foreign key de tipo_pago
        public string id_tipo_pago { get; set; }
        [JsonIgnore]
        public Tipo_Pago? tipo_pago { get; set; }
    }
}
