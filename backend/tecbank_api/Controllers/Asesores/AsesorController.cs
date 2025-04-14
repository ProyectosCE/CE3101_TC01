using Microsoft.AspNetCore.Mvc;
using tecbank_api.Models.Asesores;
using tecbank_api.Services;

namespace tecbank_api.Controllers.Asesores
{
    [ApiController]
    [Route("api/[controller]")]
    public class AsesorController : ControllerBase
    {
        private readonly JsonDataService<Asesor> _asesorService;
        private readonly JsonDataService<Rol> _rolService;
        public AsesorController()
        {
            _asesorService = new JsonDataService<Asesor>("Data/asesores.json");
            _rolService = new JsonDataService<Rol>("Data/roles.json");
        }

        [HttpGet]
        public IActionResult Get()
        {
            var asesores = _asesorService.GetAll();
            return Ok(asesores);
        }

        [HttpPost]
        public IActionResult Post([FromBody] Asesor asesor, [FromQuery] string tipo)
        {
            if (asesor == null)
            {
                return BadRequest("El asesor no puede ser nulo");
            }

            if (string.IsNullOrEmpty(tipo) || (tipo != "nuevo" && tipo != "editar" && tipo != "borrar"))
            {
                return BadRequest("El tipo debe ser 'nuevo', 'editar' o 'borrar'");
            }

            var asesores = _asesorService.GetAll();
            var existingAsesor = asesores.FirstOrDefault(a => a.id_asesor == asesor.id_asesor);

            if (tipo == "nuevo")
            {
                if (existingAsesor != null)
                {
                    return Conflict("El asesor ya existe");
                }

                // Validar existencia del rol
                var roles = _rolService.GetAll();
                if (!roles.Any(r => r.id_rol == asesor.id_rol))
                {
                    return NotFound($"No existe un rol con el ID {asesor.id_rol}");
                }

                // Agregar datos adicionales
                asesor.id_asesor = asesores.Any() ? asesores.Max(a => a.id_asesor) + 1 : 1;
                _asesorService.Add(asesor);
                return CreatedAtAction(nameof(Post), new { id = asesor.id_asesor }, asesor);
            }
            else if (tipo == "editar")
            {
                if (existingAsesor == null)
                {
                    return NotFound("El asesor no existe para editar");
                }

                // Actualizar datos del asesor
                existingAsesor.nombre = asesor.nombre;
                existingAsesor.cedula = asesor.cedula;
                existingAsesor.fecha_nacimiento = asesor.fecha_nacimiento;
                existingAsesor.monto_meta = asesor.monto_meta;
                existingAsesor.id_rol = asesor.id_rol;
                _asesorService.Update(existingAsesor);
                return Ok(existingAsesor);
            }
            else if (tipo == "borrar")
            {
                if (existingAsesor == null)
                {
                    return NotFound("El asesor no existe para borrar");
                }

                _asesorService.Delete(existingAsesor);
                return Ok("El asesor ha sido borrado exitosamente");
            }

            return BadRequest("Operación no válida");
        }
    }
}
