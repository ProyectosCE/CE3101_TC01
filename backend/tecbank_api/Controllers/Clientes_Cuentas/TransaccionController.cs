using Microsoft.AspNetCore.Mvc;
using tecbank_api.Models;
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
        private readonly JsonDataService<Tarjeta> _tarjetaService;
        private readonly JsonDataService<Tipo_Tarjeta> _tipoTarjetaService;

        public TransaccionController()
        {
            _transaccionService = new JsonDataService<Transaccion>("Data/transacciones.json");
            _cuentaService = new JsonDataService<Cuenta>("Data/cuentas.json");
            _tipoTransaccionService = new JsonDataService<Tipo_Transaccion>("Data/tipo_transacciones.json");
            _tarjetaService = new JsonDataService<Tarjeta>("Data/tarjetas.json");
            _tipoTarjetaService = new JsonDataService<Tipo_Tarjeta>("Data/tipo_tarjetas.json");
        }

        [HttpGet]
        public IActionResult Get()
        {
            var transacciones = _transaccionService.GetAll();
            return Ok(transacciones);
        }

        [HttpGet("movimientos/{numeroCuenta}")]
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

        [HttpGet("compras/{numeroCuenta}")]
        public IActionResult GetComprasPorCuenta(int numeroCuenta)
        {
            var cuenta = _cuentaService.GetAll().FirstOrDefault(c => c.numero_cuenta == numeroCuenta);
            if (cuenta == null)
                return NotFound($"No se encontró la cuenta con número {numeroCuenta}.");
            var compras = _transaccionService.GetAll()
                .Where(t => t.numero_cuenta == numeroCuenta && t.id_tipo_transaccion == "COMPRA")
                .ToList();
            return Ok(compras);
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

        [HttpPost("compra")]
        public IActionResult Compra([FromBody] Transaccion transaccion)
        {
            var tarjeta = _tarjetaService.GetAll().FirstOrDefault(t => t.numero_tarjeta == transaccion.numero_tarjeta);
            if (tarjeta == null)
                return NotFound($"No se encontró la tarjeta con número {transaccion.numero_tarjeta}.");

            var tipoTarjeta = _tipoTarjetaService.GetAll().FirstOrDefault(t => t.tipo_tarjeta == tarjeta.id_tipo_tarjeta);
            if (tipoTarjeta == null)
                return BadRequest($"No se encontró el tipo de tarjeta con ID {tarjeta.id_tipo_tarjeta}.");

            var (cuenta, tipoTransaccion, error) = ValidarTransaccion(transaccion);
            if (error != null) return BadRequest(error);

            if (tipoTransaccion.tipo_transaccion != "COMPRA")
                return BadRequest("El tipo de transacción no es válido para este endpoint.");

            transaccion.id_transaccion = _transaccionService.GetAll().Any()
                ? _transaccionService.GetAll().Max(t => t.id_transaccion) + 1
                : 1;

            if (transaccion.estado == "COMPLETADO")
            {
                if (tipoTarjeta.tipo_tarjeta == "DEBITO")
                {
                    if (cuenta.monto < transaccion.monto)
                        return BadRequest("Fondos insuficientes en la cuenta para realizar la compra.");
                    cuenta.monto -= transaccion.monto;
                    _cuentaService.Update(cuenta);
                }
                else
                {
                    return BadRequest("Tipo de tarjeta no reconocido.");
                }
            }

            // Si es una tarjeta de crédito, se verifica el monto disponible
            if (tipoTarjeta.tipo_tarjeta == "CREDITO")
            {
                if (tarjeta.monto_disponible < transaccion.monto)
                    return BadRequest("Crédito insuficiente en la tarjeta para realizar la compra.");
                tarjeta.monto_disponible -= transaccion.monto;
                _tarjetaService.Update(tarjeta);
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


