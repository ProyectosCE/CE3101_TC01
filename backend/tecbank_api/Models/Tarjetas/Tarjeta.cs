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
        - cedula: string 
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
        [StringLength(16, MinimumLength = 16, ErrorMessage = "El número de tarjeta debe tener 16 dígitos.")]
        public string numero_tarjeta { get; set; } // Número de tarjeta validado con Luhn

        [Required]
        public string marca { get; set; } // Visa, Mastercard, etc.

        [Required]
        public string tipo { get; set; } // "CREDITO" o "DEBITO"

        [Required]
        public int cvc { get; set; }

        public DateOnly fecha_vencimiento { get; set; }

        [Required]
        public int numero_cuenta { get; set; } // Foreign key to Cuenta

        public string cedula { get; set; } // Foreign key to Cliente

        public string id_tipo_tarjeta { get; set; } // Tipo de tarjeta (e.g., "DEBITO", "CREDITO")
        public double monto_disponible { get; set; } // Monto disponible para tarjetas de crédito

        public static bool ValidarLuhn(string numeroTarjeta)
        {
            int sum = 0;
            bool alternate = false;
            for (int i = numeroTarjeta.Length - 1; i >= 0; i--)
            {
                int n = int.Parse(numeroTarjeta[i].ToString());
                if (alternate)
                {
                    n *= 2;
                    if (n > 9) n -= 9;
                }
                sum += n;
                alternate = !alternate;
            }
            return (sum % 10 == 0);
        }
    }
}
