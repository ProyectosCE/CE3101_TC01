using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using tecbank_api.Models.Prestamos_Pagos;

namespace tecbank_api.Models.Asesores
{
    /* 
    Class: Asesor
        Representa a un asesor bancario dentro del sistema. Los asesores están asociados a préstamos y tienen un rol específico.

    Attributes:
        - id_asesor: int 
            Identificador único del asesor.
        - nombre: string 
            Nombre completo del asesor.
        - cedula: string 
            Cédula de identidad del asesor.
        - fecha_nacimiento: DateOnly 
            Fecha de nacimiento del asesor.
        - monto_meta: double 
            Monto meta de cumplimiento asignado al asesor.
        - id_rol: string 
            Clave foránea que indica el rol asignado al asesor (por ejemplo, "ADM", "ASE").
        - rol: Rol? 
            Objeto rol asociado al asesor. Se ignora en la serialización JSON.
        - prestamos: List<Prestamo> 
            Lista de préstamos gestionados por este asesor. Se ignora en la serialización JSON.

    Constructor:
        - Asesor() 
            Constructor predeterminado que inicializa la lista de préstamos como vacía.

    Problems:
        No se han identificado problemas durante la implementación de esta clase.

    References:
        R/A
    */
    public class Asesor
    {
        [Key]
        public int id_asesor { get; set; }
        public string nombre { get; set; }
        public string cedula { get; set; }
        public DateOnly fecha_nacimiento { get; set; }
        public double monto_meta { get; set; }

        // Foreign key to Rol
        public string id_rol { get; set; }
        [JsonIgnore]
        public Rol? rol { get; set; }

        [JsonIgnore]
        public List<Prestamo> prestamos { get; set; } = new();

    }
}
