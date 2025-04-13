using Microsoft.AspNetCore.Mvc;
using tecbank_api.Models.Asesores;
using tecbank_api.Models.Prestamos_Pagos;
using tecbank_api.Services;
using tecbank_api.Models.Clientes_Cuentas;

namespace tecbank_api.Controllers.Prestamos_Pagos
{
    [ApiController]
    [Route("api/[controller]")]
    public class PrestamoController : ControllerBase
    {
        private readonly JsonDataService<Prestamo> _prestamoService;
        private readonly JsonDataService<Asesor> _asesorService;
        private readonly JsonDataService<Cliente> _clienteService;

        public PrestamoController()
        {
            _prestamoService = new JsonDataService<Prestamo>("Data/prestamos.json");
            _asesorService = new JsonDataService<Asesor>("Data/asesores.json");
            _clienteService = new JsonDataService<Cliente>("Data/clientes.json");
        }

        [HttpGet]
        public IActionResult Get()
        {
            var prestamos = _prestamoService.GetAll();
            return Ok(prestamos);
        }

        [HttpPost]
        public IActionResult Post([FromBody] Prestamo prestamo)
        {
            if (prestamo == null)
            {
                return BadRequest("El prestamo no puede ser nulo");
            }
            // Validar existencia del asesor
            var asesores = _asesorService.GetAll();
            var asesorExistente = asesores.Any(a => a.id_asesor == prestamo.id_asesor);
            if (!asesorExistente)
            {
                return NotFound($"No existe un asesor con el ID {prestamo.id_asesor}");
            }
            // Validar existencia del cliente
            var clientes = _clienteService.GetAll();
            var clienteExistente = clientes.Any(c => c.id_cliente == prestamo.id_cliente);
            if (!clienteExistente)
            {
                return NotFound($"No existe un cliente con el ID {prestamo.id_cliente}");
            }

            // Asignar datos adicionales
            var prestamos = _prestamoService.GetAll();
            prestamo.id_prestamo = prestamos.Any() ? prestamos.Max(p => p.id_prestamo) + 1 : 1; // Incrementar el id_prestamo previo

            _prestamoService.Add(prestamo);
            return CreatedAtAction(nameof(Post), new { id = prestamo.id_prestamo }, prestamo);
        }
    }
}
