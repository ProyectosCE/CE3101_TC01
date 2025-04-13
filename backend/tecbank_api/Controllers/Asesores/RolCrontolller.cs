using Microsoft.AspNetCore.Mvc;
using tecbank_api.Models.Asesores;
using tecbank_api.Models.Clientes_Cuentas;
using tecbank_api.Services;

namespace tecbank_api.Controllers.Asesores
{
    [ApiController]
    [Route("api/[controller]")]
    public class RolCrontolller : ControllerBase
    {
        private readonly JsonDataService<Rol> _tipoRol;

        // Constructor
        public RolCrontolller()
        {
            _tipoRol = new JsonDataService<Rol>("Data/roles.json");
        }

        [HttpPost]
        public IActionResult Post([FromBody] Rol rol)
        {
            if (rol == null)
            {
                return BadRequest("Rol no puede ser nulo");
            }
            var roles = _tipoRol.GetAll();
            var existingRole = roles.FirstOrDefault(r => r.id_rol == rol.id_rol);
            if (existingRole != null)
            {
                return Conflict("El rol ya existe");
            }
            _tipoRol.Add(rol);
            return CreatedAtAction(nameof(Post), new { id = rol.id_rol }, rol);
        }
    }
}
