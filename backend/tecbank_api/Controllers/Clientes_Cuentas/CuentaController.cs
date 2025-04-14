using Microsoft.AspNetCore.Mvc;
using tecbank_api.Services;
using tecbank_api.Models.Clientes_Cuentas;

namespace tecbank_api.Controllers.Clientes_Cuentas
{
    /* Class: CuentaController
        Controlador para la gestión de cuentas bancarias, que permite obtener, agregar cuentas y consultar el saldo de una cuenta.

    Attributes:
        - _cuentaService: JsonDataService<Cuenta> - Servicio para acceder a las cuentas bancarias almacenadas.
        - _clienteService: JsonDataService<Cliente> - Servicio para acceder a los clientes.
        - _monedaService: JsonDataService<Moneda> - Servicio para acceder a las monedas.
        - _tipoCuentaService: JsonDataService<Tipo_Cuenta> - Servicio para acceder a los tipos de cuentas.

    Constructor:
        - CuentaController: Inicializa los servicios con los archivos JSON correspondientes.

    Methods:
        - Get():
            Retorna la lista de todas las cuentas disponibles.
            Endpoint: GET /api/cuenta

        - agregar_cuenta([FromBody] Cuenta cuenta):
            Permite agregar una nueva cuenta, validando la existencia del cliente, tipo de cuenta y moneda.
            Endpoint: POST /api/cuenta/agregarCuenta

        - obtener_saldo(int numeroCuenta):
            Retorna el saldo de una cuenta específica.
            Endpoint: GET /api/cuenta/saldo/{numeroCuenta}

    References:
        - N/A
    */

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

        /* Function: Get
            Recupera todas las cuentas bancarias disponibles y devuelve los datos en formato JSON.

        Params:
            - N/A

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado 200 (OK) y los datos de las cuentas en formato JSON.

        Restriction:
            Depende del servicio `JsonDataService<Cuenta>` para recuperar los datos desde el archivo JSON de cuentas.

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
        */
        [HttpGet]
        public IActionResult Get()
        {
            var cuentas = _cuentaService.GetAll();
            return Ok(cuentas);
        }

        /* Function: agregar_cuenta
            Permite agregar una nueva cuenta bancaria, validando la existencia del cliente, la moneda y el tipo de cuenta.

        Params:
            - [FromBody] Cuenta cuenta: Objeto que representa la cuenta a ser agregada.

        Returns:
            - IActionResult: Retorna una respuesta HTTP que puede ser:
                - 201 (Created) si la cuenta se agrega correctamente.
                - 400 (BadRequest) si la cuenta es nula.
                - 404 (NotFound) si no existe un cliente, tipo de cuenta o moneda válidos.
                - 409 (Conflict) si la cuenta ya existe.

        Restriction:
            Depende de los servicios `JsonDataService<Cliente>`, `JsonDataService<Moneda>` y `JsonDataService<Tipo_Cuenta>` para validar la existencia de los datos necesarios.

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
        */
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

        /* Function: obtener_saldo
            Recupera el saldo de una cuenta bancaria específica.

        Params:
            - int numeroCuenta: El número de la cuenta cuyo saldo se desea consultar.

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado 200 (OK) y el saldo de la cuenta en formato JSON.
                Si la cuenta no existe, retorna 404 (NotFound).

        Restriction:
            Depende del servicio `JsonDataService<Cuenta>` para recuperar los datos de la cuenta desde el archivo JSON de cuentas.

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
        */
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
