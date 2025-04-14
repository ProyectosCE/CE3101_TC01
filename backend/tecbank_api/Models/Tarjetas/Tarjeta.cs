using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using tecbank_api.Models.Clientes_Cuentas;

namespace tecbank_api.Models
{
    /* 
    Class: Tarjeta
        Representa una tarjeta asociada a un cliente en el sistema bancario. Puede ser de tipo débito o crédito.

    Attributes:
        - numero_tarjeta: int 
            Identificador único de la tarjeta.
        - cvc: int 
            Código de verificación de la tarjeta (CVC).
        - fecha_vencimiento: DateOnly 
            Fecha de vencimiento de la tarjeta.
        - monto_disponible: double? 
            Monto disponible en la tarjeta (solo aplica para tarjetas de débito).
        - monto_credito: double? 
            Monto de crédito disponible en la tarjeta (solo aplica para tarjetas de crédito).
        - id_cliente: int 
            Clave foránea que hace referencia al cliente propietario de la tarjeta.
        - cliente: Cliente? 
            Objeto cliente asociado a la tarjeta. Se ignora en la serialización JSON.
        - id_tipo_tarjeta: string 
            Clave foránea que indica el tipo de tarjeta (por ejemplo, "DEBITO", "CREDITO").
        - tipo_tarjeta: Tipo_Tarjeta? 
            Objeto que representa el tipo de tarjeta asociado. Se ignora en la serialización JSON.

    Constructor:
        - Tarjeta() 
            Constructor predeterminado que inicializa los valores de la tarjeta.

    Problems:
        No se han identificado problemas durante la implementación de esta clase.

    References:
        N/A
    */
    public class Tarjeta
    {
        [Key]
        public int numero_tarjeta { get; set; } // id
        public int cvc { get; set; }
        public DateOnly fecha_vencimiento { get; set; }
        public double? monto_disponible { get; set; }
        public double? monto_credito { get; set; }

        // Foreign key to Cliente
        public int id_cliente { get; set; }
        [JsonIgnore]
        public Cliente? cliente { get; set; }

        //Foreign key to Tipo_Tarjeta
        public string id_tipo_tarjeta { get; set; }
        [JsonIgnore]
        public Tipo_Tarjeta? tipo_tarjeta { get; set; }
    }
}
