using Microsoft.AspNetCore.Mvc;
using tecbank_api.Models;
using tecbank_api.Models.Clientes_Cuentas;
using tecbank_api.Services;

namespace tecbank_api.Controllers.Tarjetas
{
    [ApiController]
    [Route("api/[controller]")]
    public class TarjetaController : ControllerBase
    {
        private readonly JsonDataService<Tarjeta> _tarjetaService;
        private readonly JsonDataService<Cuenta> _cuentaService;
        private readonly JsonDataService<Tipo_Tarjeta> _tipoTarjetaService;
        public TarjetaController()
        {
            _tarjetaService = new JsonDataService<Tarjeta>("Data/tarjetas.json");
            _cuentaService = new JsonDataService<Cuenta>("Data/cuentas.json");
            _tipoTarjetaService = new JsonDataService<Tipo_Tarjeta>("Data/tipo_tarjetas.json");
        }

        [HttpGet]
        public IActionResult Get()
        {
            var tarjetas = _tarjetaService.GetAll();
            return Ok(tarjetas);
        }

        [HttpPost]
        public IActionResult Post([FromBody] Tarjeta tarjeta)
        {
            if (tarjeta == null)
            {
                return BadRequest("La tarjeta no puede ser nula");
            }
            // Validar existencia de la cuenta
            var cuentas = _cuentaService.GetAll();
            var cuentaExistente = cuentas.Any(c => c.numero_cuenta == tarjeta.numero_cuenta);
            if (!cuentaExistente)
            {
                return NotFound($"No existe una cuenta con numero de cuenta = {tarjeta.numero_cuenta}");
            }
            // Validar existencia del tipo de tarjeta
            var tiposTarjeta = _tipoTarjetaService.GetAll();
            var tipoTarjetaExistente = tiposTarjeta.Any(t => t.tipo_tarjeta == tarjeta.id_tipo_tarjeta);
            if (!tipoTarjetaExistente)
            {
                return NotFound($"No existe un tipo de tarjeta con el código {tarjeta.id_tipo_tarjeta}");
            }
            _tarjetaService.Add(tarjeta);
            return CreatedAtAction(nameof(Post), new { id = tarjeta.numero_tarjeta }, tarjeta);
        }

    }
}
