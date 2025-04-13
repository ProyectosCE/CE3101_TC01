using Microsoft.AspNetCore.Mvc;
using tecbank_api.Models.Clientes_Cuentas;
using tecbank_api.Services;

namespace tecbank_api.Controllers.Clientes_Cuentas
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransaccionController : ControllerBase
    {
        private readonly JsonDataService<Transaccion> _transaccionService;
        private readonly JsonDataService<Cuenta> _cuentaService;
        private readonly JsonDataService<Tipo_Transaccion> _tipoTransaccionService;

        public TransaccionController()
        {
            _transaccionService = new JsonDataService<Transaccion>("Data/transacciones.json");
            _cuentaService = new JsonDataService<Cuenta>("Data/cuentas.json");
            _tipoTransaccionService = new JsonDataService<Tipo_Transaccion>("Data/tipo_transacciones.json");
        }

        [HttpGet]
        public IActionResult Get()
        {
            var transacciones = _transaccionService.GetAll();
            return Ok(transacciones);
        }

        [HttpPost]
        public IActionResult Post([FromBody] Transaccion nuevaTransaccion)
        {
            if (nuevaTransaccion == null)
            {
                return BadRequest("La transacción no puede ser nula.");
            }

            // Validar que la cuenta exista
            var cuenta = _cuentaService.GetAll().FirstOrDefault(c => c.numero_cuenta == nuevaTransaccion.numero_cuenta);
            if (cuenta == null)
            {
                return NotFound($"No se encontró la cuenta con número {nuevaTransaccion.numero_cuenta}.");
            }

            // Validar que el tipo de transacción exista
            var tipoTransaccion = _tipoTransaccionService.GetAll().FirstOrDefault(t => t.tipo_transaccion == nuevaTransaccion.id_tipo_transaccion);
            if (tipoTransaccion == null)
            {
                return NotFound($"No se encontró el tipo de transacción con ID {nuevaTransaccion.id_tipo_transaccion}.");
            }

            //Validar que la moneda de la transaccion coincida con la moneda de la cuenta
            var moneda = _cuentaService.GetAll().FirstOrDefault(c => c.id_moneda == nuevaTransaccion.moneda);
            if (moneda == null)
            {
                return NotFound($"No se encontró la moneda con ID {nuevaTransaccion.moneda}.");
            }

            // Asignar valores adicionales
            nuevaTransaccion.id_transaccion = _transaccionService.GetAll().Count + 1; // Generar un ID único

            // Guardar la transacción
            _transaccionService.Add(nuevaTransaccion);

            return CreatedAtAction(nameof(Get), new { id = nuevaTransaccion.id_transaccion }, nuevaTransaccion);
        }

    }
}


