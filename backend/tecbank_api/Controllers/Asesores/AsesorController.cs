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
        public IActionResult Post([FromBody] Asesor asesor)
        {
            if (asesor == null)
            {
                return BadRequest("El asesor no puede ser nulo");
            }

            // Validar existencia del asesor
            var asesores = _asesorService.GetAll();
            var existingAsesor = asesores.FirstOrDefault(a => a.id_asesor == asesor.id_asesor);
            if (existingAsesor != null)
            {
                return Conflict("El asesor ya existe");
            }

            // Validar existencia del rol
            var roles = _rolService.GetAll();
            var rolExistente = roles.Any(r => r.id_rol == asesor.id_rol);
            if (!rolExistente)
            {
                return NotFound($"No existe un rol con el ID {asesor.id_rol}");
            }

            _asesorService.Add(asesor);
            return CreatedAtAction(nameof(Post), new { id = asesor.id_asesor }, asesor);
        }
    }
}
