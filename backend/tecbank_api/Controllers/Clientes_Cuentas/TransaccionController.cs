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

        [HttpGet("cuenta/{numeroCuenta}")]
        public IActionResult GetTransaccionesPorCuenta(int numeroCuenta)
        {
            var cuenta = _cuentaService.GetAll().FirstOrDefault(c => c.numero_cuenta == numeroCuenta);
            if (cuenta == null)
                return NotFound($"No se encontró la cuenta con número {numeroCuenta}.");

            var transacciones = _transaccionService.GetAll()
                .Where(t => t.numero_cuenta == numeroCuenta || t.cuenta_destino == numeroCuenta)
                .ToList();

            return Ok(transacciones);
        }


        [HttpPost("deposito")]
        public IActionResult Deposito([FromBody] Transaccion transaccion)
        {
            var (cuenta, tipo, error) = ValidarTransaccion(transaccion);
            if (error != null) return BadRequest(error);

            if (tipo.tipo_transaccion != "DEPOSITO")
                return BadRequest("El tipo de transacción no es válido para este endpoint.");

            transaccion.id_transaccion = _transaccionService.GetAll().Any() ? _transaccionService.GetAll().Max(t => t.id_transaccion) + 1 : 1;

            if (transaccion.estado == "COMPLETADO")
            {
                cuenta.monto += transaccion.monto;
                _cuentaService.Update(cuenta);
                
            }

            _transaccionService.Add(transaccion);
            return CreatedAtAction(nameof(Get), new { id = transaccion.id_transaccion }, transaccion);
        }

        [HttpPost("retiro")]
        public IActionResult Retiro([FromBody] Transaccion transaccion)
        {
            var (cuenta, tipo, error) = ValidarTransaccion(transaccion);
            if (error != null) return BadRequest(error);

            if (tipo.tipo_transaccion != "RETIRO")
                return BadRequest("El tipo de transacción no es válido para este endpoint.");

            if (cuenta.monto < transaccion.monto)
                return BadRequest("Fondos insuficientes para realizar el retiro.");

            transaccion.id_transaccion = _transaccionService.GetAll().Any() ? _transaccionService.GetAll().Max(t => t.id_transaccion) + 1 : 1;

            if (transaccion.estado == "COMPLETADO")
            {
                cuenta.monto -= transaccion.monto;
                _cuentaService.Update(cuenta);
            }

            _transaccionService.Add(transaccion);

            return CreatedAtAction(nameof(Get), new { id = transaccion.id_transaccion }, transaccion);
        }

        [HttpPost("transferencia")]
        public IActionResult Transferencia([FromBody] Transaccion transaccion)
        {
            var (cuentaOrigen, tipo, error) = ValidarTransaccion(transaccion);
            if (error != null) return BadRequest(error);

            if (tipo.tipo_transaccion != "TRANSFERENCIA")
                return BadRequest("El tipo de transacción no es válido para este endpoint.");

            if (!transaccion.cuenta_destino.HasValue)
                return BadRequest("Debe especificar la cuenta destino para una transferencia.");

            if (transaccion.cuenta_destino == transaccion.numero_cuenta)
                return BadRequest("La cuenta destino no puede ser igual a la cuenta de origen.");

            var cuentaDestino = _cuentaService.GetAll().FirstOrDefault(c => c.numero_cuenta == transaccion.cuenta_destino.Value);
            if (cuentaDestino == null)
                return NotFound($"No se encontró la cuenta destino con número {transaccion.cuenta_destino}.");

            if (cuentaOrigen.id_moneda != cuentaDestino.id_moneda)
                return BadRequest("Las cuentas origen y destino deben usar la misma moneda.");

            if (cuentaOrigen.monto < transaccion.monto)
                return BadRequest("Fondos insuficientes para realizar la transferencia.");

            transaccion.id_transaccion = _transaccionService.GetAll().Any()
                ? _transaccionService.GetAll().Max(t => t.id_transaccion) + 1
                : 1;

            if (transaccion.estado == "COMPLETADO")
            {
                cuentaOrigen.monto -= transaccion.monto;
                cuentaDestino.monto += transaccion.monto;

                _cuentaService.Update(cuentaOrigen);
                _cuentaService.Update(cuentaDestino);
            }

            _transaccionService.Add(transaccion);

            return CreatedAtAction(nameof(Get), new { id = transaccion.id_transaccion }, transaccion);
        }


        private (Cuenta cuenta, Tipo_Transaccion tipo, string error) ValidarTransaccion(Transaccion transaccion)
        {
            var cuenta = _cuentaService.GetAll().FirstOrDefault(c => c.numero_cuenta == transaccion.numero_cuenta);
            if (cuenta == null)
                return (null, null, $"No se encontró la cuenta con número {transaccion.numero_cuenta}.");

            var tipo = _tipoTransaccionService.GetAll().FirstOrDefault(t => t.tipo_transaccion == transaccion.id_tipo_transaccion);
            if (tipo == null)
                return (null, null, $"No se encontró el tipo de transacción con ID {transaccion.id_tipo_transaccion}.");

            if (cuenta.id_moneda != transaccion.moneda)
                return (null, null, "La moneda de la transacción no coincide con la de la cuenta.");

            return (cuenta, tipo, null);
        }
    }
}


