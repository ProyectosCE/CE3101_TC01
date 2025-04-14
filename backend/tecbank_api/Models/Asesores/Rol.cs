using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace tecbank_api.Models.Asesores
{
    /* 
    Class: Rol
        Representa un rol asignado a los asesores dentro del sistema (por ejemplo, "Asesor", "Administrador").

    Attributes:
        - id_rol: string 
            Identificador único del rol (por ejemplo, "ADM", "ASE").
        - descripcion: string 
            Descripción textual del rol.
        - asesores: List<Asesor> 
            Lista de asesores asociados a este rol. Se ignora en la serialización JSON.

    Constructor:
        - Rol() 
            Constructor predeterminado que inicializa la lista de asesores como vacía.

    Problems:
        No se han identificado problemas durante la implementación de esta clase.

    References:
        N/A
    */
    public class Rol
    {
        [Key]
        public string id_rol { get; set; }
        public string descripcion { get; set; }

        [JsonIgnore]
        public List<Asesor> asesores { get; set; } = new();
    }
}
