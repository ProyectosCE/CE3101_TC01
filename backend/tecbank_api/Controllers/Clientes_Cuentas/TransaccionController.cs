using Microsoft.AspNetCore.Mvc;
using tecbank_api.Models;
using tecbank_api.Models.Clientes_Cuentas;
using tecbank_api.Services;

namespace tecbank_api.Controllers.Clientes_Cuentas
{
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
        - Get():
            Retorna todas las transacciones registradas.
            Endpoint: GET /api/transaccion

        - GetTransaccionesPorCuenta(int numeroCuenta):
            Retorna todas las transacciones asociadas a una cuenta (origen o destino).
            Endpoint: GET /api/transaccion/movimientos/{numeroCuenta}

        - GetComprasPorCuenta(int numeroCuenta):
            Retorna todas las transacciones de tipo "COMPRA" asociadas a una cuenta.
            Endpoint: GET /api/transaccion/compras/{numeroCuenta}

        - Deposito(Transaccion transaccion):
            Procesa un depósito a una cuenta.
            Endpoint: POST /api/transaccion/deposito

        - Retiro(Transaccion transaccion):
            Procesa un retiro desde una cuenta.
            Endpoint: POST /api/transaccion/retiro

        - Transferencia(Transaccion transaccion):
            Procesa una transferencia entre dos cuentas.
            Endpoint: POST /api/transaccion/transferencia

        - Compra(Transaccion transaccion):
            Procesa una compra con tarjeta (débito o crédito).
            Endpoint: POST /api/transaccion/compra

        - ValidarTransaccion(Transaccion transaccion):
            Método auxiliar para validar existencia de cuenta, tipo de transacción y coincidencia de moneda.

    Problems:
        - No se valida si la tarjeta está vencida, bloqueada o con PIN incorrecto.
        - No se maneja la reversión de transacciones.
        - No se controla concurrencia para evitar condiciones de carrera en saldos.

    References:
        - N/A
    */

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

        /* Function: Get
            Recupera todas las transacciones realizadas y las devuelve en formato JSON.

        Params:
            - N/A

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado 200 (OK) y los datos de las transacciones en formato JSON.

        Restriction:
            Depende del servicio `JsonDataService<Transaccion>` para recuperar los datos desde el archivo JSON de transacciones.

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
        */
        [HttpGet]
        public IActionResult Get()
        {
            var transacciones = _transaccionService.GetAll();
            return Ok(transacciones);
        }

        /* Function: GetTransaccionesPorCuenta
            Recupera las transacciones asociadas a una cuenta específica. Se pueden obtener transacciones relacionadas con la cuenta de origen o destino.

        Params:
            - numeroCuenta: El número de cuenta de la cual se desean obtener las transacciones.

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado 200 (OK) y las transacciones asociadas a la cuenta en formato JSON, o un código 404 (NotFound) si no se encuentra la cuenta.

        Restriction:
            Depende del servicio `JsonDataService<Cuenta>` para validar la existencia de la cuenta y `JsonDataService<Transaccion>` para recuperar las transacciones.

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
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
            - numeroCuenta: El número de cuenta de la cual se desean obtener las compras.

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado 200 (OK) y las compras asociadas a la cuenta en formato JSON, o un código 404 (NotFound) si no se encuentra la cuenta.

        Restriction:
            Depende del servicio `JsonDataService<Cuenta>` para validar la existencia de la cuenta y `JsonDataService<Transaccion>` para recuperar las transacciones de tipo "COMPRA".

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
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
            - transaccion: Objeto `Transaccion` que contiene la información de la transacción a realizar.

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado 201 (Created) si la transacción es exitosa, o un código de error correspondiente si hay un problema.

        Restriction:
            Depende del servicio `JsonDataService<Cuenta>` para actualizar el saldo de la cuenta y `JsonDataService<Transaccion>` para agregar la transacción.

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
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
            Realiza un retiro de una cuenta. Valida que la transacción sea de tipo "RETIRO" y que la cuenta tenga fondos suficientes para realizar el retiro.

        Params:
            - transaccion: Objeto `Transaccion` que contiene la información de la transacción a realizar.

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado 201 (Created) si la transacción es exitosa, o un código de error correspondiente si hay un problema.

        Restriction:
            Depende del servicio `JsonDataService<Cuenta>` para actualizar el saldo de la cuenta y `JsonDataService<Transaccion>` para agregar la transacción.

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
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
            - transaccion: Objeto `Transaccion` que contiene la información de la transacción a realizar.

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado 201 (Created) si la transacción es exitosa, o un código de error correspondiente si hay un problema.

        Restriction:
            Depende del servicio `JsonDataService<Cuenta>` para actualizar el saldo de las cuentas y `JsonDataService<Transaccion>` para agregar la transacción.

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
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
            - transaccion: Objeto `Transaccion` que contiene la información de la transacción a realizar.

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado 201 (Created) si la transacción es exitosa, o un código de error correspondiente si hay un problema.

        Restriction:
            Depende del servicio `JsonDataService<Tarjeta>` para verificar la tarjeta y el tipo de tarjeta, y `JsonDataService<Cuenta>` para actualizar el saldo de la cuenta y `JsonDataService<Transaccion>` para agregar la transacción.

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
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
            - transaccion: Objeto `Transaccion` que contiene los datos de la transacción a validar.

        Returns:
            - Tuple: Retorna una tupla con tres elementos: la cuenta asociada a la transacción, el tipo de transacción y un mensaje de error (si aplica).

        Restriction:
            Depende del servicio `JsonDataService<Cuenta>` y `JsonDataService<Tipo_Transaccion>` para validar las transacciones.

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
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


