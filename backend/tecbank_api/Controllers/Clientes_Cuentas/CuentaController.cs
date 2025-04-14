using Microsoft.AspNetCore.Mvc;
using tecbank_api.Services;
using tecbank_api.Models.Clientes_Cuentas;

namespace tecbank_api.Controllers.Clientes_Cuentas
{
    [ApiController]
    [Route("api/[controller]")]
    public class CuentaController : ControllerBase
    {
        private readonly JsonDataService<Cuenta> _cuentaService;
        private readonly JsonDataService<Cliente> _clienteService;
        private readonly JsonDataService<Moneda> _monedaService;
        private readonly JsonDataService<Tipo_Cuenta> _tipoCuentaService;

        public CuentaController()
        {
            _cuentaService = new JsonDataService<Cuenta>("Data/cuentas.json");
            _clienteService = new JsonDataService<Cliente>("Data/clientes.json");
            _monedaService = new JsonDataService<Moneda>("Data/monedas.json");
            _tipoCuentaService = new JsonDataService<Tipo_Cuenta>("Data/tipo_cuentas.json");
        }

        [HttpGet]
        public IActionResult Get()
        {
            var cuentas = _cuentaService.GetAll();
            return Ok(cuentas);
        }

        [HttpPost("agregarCuenta")]
        public IActionResult agregar_cuenta([FromBody] Cuenta cuenta)
        {
            if (cuenta == null)
            {
                return BadRequest("La cuenta no puede ser nula");
            }

            // Validar existencia del cliente
            var clientes = _clienteService.GetAll();
            var clienteExistente = clientes.Any(c => c.id_cliente == cuenta.id_cliente);
            if (!clienteExistente)
            {
                return NotFound($"No existe un cliente con id_cliente = {cuenta.id_cliente}");
            }

            // Validar si ya existe la cuenta
            var cuentas = _cuentaService.GetAll();
            var existingAccount = cuentas.FirstOrDefault(c => c.numero_cuenta == cuenta.numero_cuenta);
            if (existingAccount != null)
            {
                return Conflict("La cuenta ya existe");
            }

            // Validar existencia de la moneda
            var monedas = _monedaService.GetAll();
            var monedaExistente = monedas.Any(m => m.moneda == cuenta.id_moneda);
            if (!monedaExistente)
            {
                return NotFound($"No existe una moneda con el código {cuenta.moneda}");
            }

            // Validar existencia del tipo de cuenta
            var tiposCuentas = _tipoCuentaService.GetAll();
            var tipoCuentaExistente = tiposCuentas.Any(tc => tc.tipo_cuenta == cuenta.id_tipo_cuenta);
            if (!tipoCuentaExistente)
            {
                return NotFound($"No existe un tipo de cuenta con el código {cuenta.tipo_cuenta}");
            }

            _cuentaService.Add(cuenta);
            return CreatedAtAction(nameof(agregar_cuenta), new { id = cuenta.numero_cuenta }, cuenta);
        }

        [HttpGet("saldo/{numeroCuenta}")]
        public IActionResult obtener_saldo(int numeroCuenta)
        {
            var cuenta = _cuentaService.GetAll().FirstOrDefault(c => c.numero_cuenta == numeroCuenta);
            if (cuenta == null)
            {
                return NotFound($"No se encontró la cuenta con número {numeroCuenta}.");
            }
            return Ok(new { saldo = cuenta.monto });
        }
    }
}
