using Microsoft.AspNetCore.Mvc;
using tecbank_api.Models;
using tecbank_api.Models.Clientes_Cuentas;
using tecbank_api.Models.Prestamos_Pagos;
using tecbank_api.Services;

namespace tecbank_api.Controllers.Prestamos_Pagos
{
    [ApiController]
    [Route("api/[controller]")]
    public class MoraController : ControllerBase
    {
        private readonly JsonDataService<Mora> _moraService;
        private readonly JsonDataService<Prestamo> _prestamoService;
        private readonly JsonDataService<Cliente> _clienteService;

        public MoraController()
        {
            _moraService = new JsonDataService<Mora>("Data/moras.json");
            _prestamoService = new JsonDataService<Prestamo>("Data/prestamos.json");
            _clienteService = new JsonDataService<Cliente>("Data/clientes.json");

        }

        [HttpGet]
        public IActionResult Get()
        {
            var moras = _moraService.GetAll();
            return Ok(moras);
        }

        [HttpPost]
        public IActionResult Post([FromBody] Mora mora)
        {
            if (mora == null)
            {
                return BadRequest("La mora no puede ser nula");
            }

            // Validar si ya existe la mora
            var moras = _moraService.GetAll();
            var existingMora = moras.FirstOrDefault(m => m.id_mora == mora.id_mora);
            if (existingMora != null)
            {
                return Conflict("La mora ya existe");
            }

            // Validar existencia del prestamo
            var prestamos = _prestamoService.GetAll();
            var prestamoExistente = prestamos.FirstOrDefault(p => p.id_prestamo == mora.id_prestamo);
            if (prestamoExistente == null)
            {
                return NotFound($"No existe un prestamo con el ID {mora.id_prestamo}");
            }

            // Validar existencia del cliente
            var clientes = _clienteService.GetAll();
            var clienteExistente = clientes.FirstOrDefault(c => c.id_cliente == prestamoExistente.id_cliente);
            if (clienteExistente == null)
            {
                return NotFound($"No existe un cliente con el ID {prestamoExistente.id_cliente}");
            }

            // Agregar datos adicionales
            mora.cedula = clienteExistente.cedula;
            mora.nombre_completo = clienteExistente.nombre_completo;
            mora.id_mora = moras.Any() ? moras.Max(m => m.id_mora) + 1 : 1; // Incrementar el id_mora previo


            _moraService.Add(mora);
            return CreatedAtAction(nameof(Post), new { id = mora.id_mora }, mora);
        }
    }
}
