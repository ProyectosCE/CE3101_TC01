using Microsoft.AspNetCore.Mvc;
using tecbank_api.Models.Asesores;
using tecbank_api.Services;

namespace tecbank_api.Controllers.Asesores
{
    [ApiController]
    [Route("api/[controller]")]
    public class RolCrontroller : ControllerBase
    {
        private readonly JsonDataService<Rol> _tipoRol;

        // Constructor
        public RolCrontroller()
        {
            _tipoRol = new JsonDataService<Rol>("Data/roles.json");
        }

        [HttpGet]
        public IActionResult Get()
        {
            var roles = _tipoRol.GetAll();
            return Ok(roles);
        }

        [HttpPost]
        public IActionResult Post([FromBody] Rol rol, [FromQuery] string tipo)
        {
            if (rol == null)
            {
                return BadRequest("Rol no puede ser nulo");
            }

            if (string.IsNullOrEmpty(tipo) || (tipo != "nuevo" && tipo != "editar" && tipo != "borrar"))
            {
                return BadRequest("El tipo debe ser 'nuevo', 'editar' o 'borrar'");
            }

            var roles = _tipoRol.GetAll();
            var existingRole = roles.FirstOrDefault(r => r.id_rol == rol.id_rol);

            if (tipo == "nuevo")
            {
                if (existingRole != null)
                {
                    return Conflict("El rol ya existe");
                }
                _tipoRol.Add(rol);
                return CreatedAtAction(nameof(Post), new { id = rol.id_rol }, rol);
            }
            else if (tipo == "editar")
            {
                if (existingRole == null)
                {
                    return NotFound("El rol no existe para editar");
                }
                existingRole.descripcion = rol.descripcion;
                _tipoRol.Update(existingRole);
                return Ok(existingRole);
            }
            else if (tipo == "borrar")
            {
                if (existingRole == null)
                {
                    return NotFound("El rol no existe para borrar");
                }
                if (existingRole.id_rol != rol.id_rol)
                {
                    return BadRequest("El id_rol del rol no coincide");
                }
                _tipoRol.Delete(existingRole);
                return Ok("El rol ha sido borrado exitosamente");
            }

            return BadRequest("Operación no válida");
        }
    }
}
