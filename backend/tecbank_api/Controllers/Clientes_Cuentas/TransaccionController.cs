/*
================================== LICENCIA ==============
====================================
MIT License
Copyright (c) 2025 José Bernardo Barquero Bonilla,
Jimmy Feng Feng,
Alexander Montero Vargas
Adrian Muñoz Alvarado,
Diego Salas Ovares.
Consulta el archivo LICENSE para más detalles.
=======================================================
=======================================
*/

/* Class: TransaccionController
Controlador para gestionar transacciones bancarias dentro del sistema, como depósitos, retiros, transferencias y compras con tarjeta. Permite consultar movimientos por cuenta y clasificados por tipo.

Attributes:
- _transaccionService: JsonDataService<Transaccion> - Servicio para manipular datos de transacciones.
- _cuentaService: JsonDataService<Cuenta> - Servicio para obtener y actualizar cuentas.
- _tipoTransaccionService: JsonDataService<Tipo_Transaccion> - Servicio para validar tipos de transacción.
- _tarjetaService: JsonDataService<Tarjeta> - Servicio para obtener y actualizar tarjetas.
- _tipoTarjetaService: JsonDataService<Tipo_Tarjeta> - Servicio para validar el tipo de tarjeta.

Constructor:
- TransaccionController: Inicializa los servicios requeridos desde archivos JSON.

Methods:
- Get: Retorna todas las transacciones registradas.
- GetTransaccionesPorCuenta: Retorna todas las transacciones asociadas a una cuenta (origen o destino).
- GetComprasPorCuenta: Retorna todas las transacciones de tipo "COMPRA" asociadas a una cuenta.
- Deposito: Procesa un depósito a una cuenta.
- Retiro: Procesa un retiro desde una cuenta.
- Transferencia: Procesa una transferencia entre dos cuentas.
- Compra: Procesa una compra con tarjeta (débito o crédito).
- ValidarTransaccion: Método auxiliar para validar existencia de cuenta, tipo de transacción y coincidencia de moneda.

Problems:
- No se valida si la tarjeta está vencida, bloqueada o con PIN incorrecto.
- No se maneja la reversión de transacciones.
- No se controla concurrencia para evitar condiciones de carrera en saldos.

References:
- N/A
*/

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
        // Servicios para transacciones, cuentas, tipos de transacción, tarjetas y tipos de tarjeta
        private readonly JsonDataService<Transaccion> _transaccionService;
        private readonly JsonDataService<Cuenta> _cuentaService;
        private readonly JsonDataService<Tipo_Transaccion> _tipoTransaccionService;
        private readonly JsonDataService<Tarjeta> _tarjetaService;
        private readonly JsonDataService<Tipo_Tarjeta> _tipoTarjetaService;

        // Constructor: Inicializa los servicios con los archivos JSON.
        public TransaccionController()
        {
            _transaccionService = new JsonDataService<Transaccion>("Data/transacciones.json");
            _cuentaService = new JsonDataService<Cuenta>("Data/cuentas.json");
            _tipoTransaccionService = new JsonDataService<Tipo_Transaccion>("Data/tipo_transacciones.json");
            _tarjetaService = new JsonDataService<Tarjeta>("Data/tarjetas.json");
            _tipoTarjetaService = new JsonDataService<Tipo_Tarjeta>("Data/tipo_tarjetas.json");
        }

        /* Function: Get
        Recupera todas las transacciones realizadas y las devuelve en formato JSON.

        Params:
        - Ninguno.

        Returns:
        - IActionResult: HTTP 200 (OK) con los datos de las transacciones.
        */
        [HttpGet]
        public IActionResult Get()
        {
            var transacciones = _transaccionService.GetAll();
            return Ok(transacciones);
        }

        /* Function: GetTransaccionesCuenta
        Recupera todas las transacciones asociadas a una cuenta (origen o destino).

        Params:
        - cuenta: int - Número de cuenta.

        Returns:
        - IActionResult: HTTP 200 (OK) con las transacciones, o 404 si no existe la cuenta.
        */
        [HttpGet("transacciones/{cuenta}")]
        public IActionResult GetTransaccionesCuenta(int cuenta)
        {
            var cuentaExistente = _cuentaService.GetAll().FirstOrDefault(c => c.numero_cuenta == cuenta);
            if (cuentaExistente == null)
                return NotFound($"No se encontró la cuenta con número {cuenta}.");

            var transacciones = _transaccionService.GetAll()
                .Where(t => t.numero_cuenta == cuenta || t.cuenta_destino == cuenta)
                .ToList();

            return Ok(transacciones);
        }

        /* Function: GetTransaccionesPorCuenta
        Recupera las transacciones asociadas a una cuenta específica (origen o destino).

        Params:
        - numeroCuenta: int - Número de cuenta.

        Returns:
        - IActionResult: HTTP 200 (OK) con las transacciones, o 404 si no existe la cuenta.
        */
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

        /* Function: GetComprasPorCuenta
        Recupera las transacciones de tipo "COMPRA" asociadas a una cuenta específica.

        Params:
        - numeroCuenta: int - Número de cuenta.

        Returns:
        - IActionResult: HTTP 200 (OK) con las compras, o 404 si no existe la cuenta.
        */
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

        /* Function: Deposito
        Realiza un depósito en una cuenta. Valida que la transacción sea de tipo "DEPOSITO" y actualiza el saldo de la cuenta si la transacción se marca como "COMPLETADO".

        Params:
        - transaccion: Transaccion - Objeto con la información de la transacción.

        Returns:
        - IActionResult: HTTP 201 (Created) si la transacción es exitosa, o error.
        */
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

        /* Function: Retiro
        Realiza un retiro de una cuenta. Valida que la transacción sea de tipo "RETIRO" y que la cuenta tenga fondos suficientes.

        Params:
        - transaccion: Transaccion - Objeto con la información de la transacción.

        Returns:
        - IActionResult: HTTP 201 (Created) si la transacción es exitosa, o error.
        */
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

        /* Function: Transferencia
        Realiza una transferencia entre dos cuentas. Valida que las cuentas de origen y destino existan, que tengan la misma moneda y que la cuenta de origen tenga fondos suficientes.

        Params:
        - transaccion: Transaccion - Objeto con la información de la transacción.

        Returns:
        - IActionResult: HTTP 201 (Created) si la transacción es exitosa, o error.
        */
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

        /* Function: Compra
        Realiza una compra utilizando una tarjeta. Si la tarjeta es de débito, valida que la cuenta tenga fondos suficientes. Si es de crédito, valida que el crédito disponible sea suficiente.

        Params:
        - transaccion: Transaccion - Objeto con la información de la transacción.

        Returns:
        - IActionResult: HTTP 201 (Created) si la transacción es exitosa, o error.
        */
        [HttpPost("compra")]
        public IActionResult Compra([FromBody] Transaccion transaccion)
        {
            var tarjeta = _tarjetaService.GetAll().FirstOrDefault(t => t.numero_tarjeta == transaccion.numero_tarjeta.ToString());
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

        /* Function: ValidarTransaccion
        Valida los detalles de una transacción, asegurando que la cuenta y el tipo de transacción sean válidos, y que la moneda de la cuenta coincida con la moneda de la transacción.

        Params:
        - transaccion: Transaccion - Objeto con los datos de la transacción a validar.

        Returns:
        - Tuple: (Cuenta, Tipo_Transaccion, string) - La cuenta asociada, el tipo de transacción y un mensaje de error (si aplica).
        */
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


