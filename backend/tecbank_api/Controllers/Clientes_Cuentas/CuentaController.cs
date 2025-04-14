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
        - Get([FromQuery] string tipo):
            Retorna la lista de todas las cuentas disponibles o las cuentas asociadas a una cédula específica.
            Endpoint: GET /api/cuenta

        - agregar_cuenta([FromBody] Cuenta cuenta, [FromQuery] string tipo):
            Permite agregar, editar o borrar una cuenta, validando la existencia del cliente, tipo de cuenta y moneda.
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
            Recupera todas las cuentas bancarias disponibles o las cuentas asociadas a una cédula específica.

        Params:
            - [FromQuery] string tipo: Parámetro de consulta que puede ser "all" para obtener todas las cuentas o una cédula para obtener cuentas asociadas.

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado 200 (OK) y los datos de las cuentas en formato JSON.
                Si no se encuentran cuentas para una cédula específica, retorna 404 (NotFound).

        Restriction:
            Depende del servicio `JsonDataService<Cuenta>` para recuperar los datos desde el archivo JSON de cuentas.

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
        */
        [HttpGet]
        public IActionResult Get([FromQuery] string tipo)
        {
            if (tipo == "all")
            {
                var cuentas = _cuentaService.GetAll();
                return Ok(cuentas);
            }

            var cuentasPorCedula = _cuentaService.GetAll()
                .Where(c => c.cedula == tipo)
                .ToList();

            if (!cuentasPorCedula.Any())
            {
                return NotFound($"No se encontraron cuentas para la cédula {tipo}.");
            }

            return Ok(cuentasPorCedula);
        }

        /* Function: agregar_cuenta
            Permite agregar, editar o borrar una cuenta bancaria, validando la existencia del cliente, la moneda y el tipo de cuenta.

        Params:
            - [FromBody] Cuenta cuenta: Objeto que representa la cuenta a ser gestionada.
            - [FromQuery] string tipo: Tipo de operación a realizar ("nuevo", "editar", "borrar").

        Returns:
            - IActionResult: Retorna una respuesta HTTP que puede ser:
                - 201 (Created) si la cuenta se agrega correctamente.
                - 200 (OK) si la cuenta se edita o borra correctamente.
                - 400 (BadRequest) si la cuenta es nula o el tipo de operación es inválido.
                - 404 (NotFound) si no existe un cliente, tipo de cuenta, moneda válidos o la cuenta no existe.
                - 409 (Conflict) si la cuenta ya existe.

        Restriction:
            Depende de los servicios `JsonDataService<Cliente>`, `JsonDataService<Moneda>` y `JsonDataService<Tipo_Cuenta>` para validar la existencia de los datos necesarios.

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
        */
        [HttpPost("agregarCuenta")]
        public IActionResult agregar_cuenta([FromBody] Cuenta cuenta, [FromQuery] string tipo)
        {
            if (cuenta == null)
            {
                return BadRequest("La cuenta no puede ser nula");
            }

            if (string.IsNullOrEmpty(tipo) || (tipo != "nuevo" && tipo != "editar" && tipo != "borrar"))
            {
                return BadRequest("El tipo debe ser 'nuevo', 'editar' o 'borrar'");
            }

            var cuentas = _cuentaService.GetAll();
            var existingAccount = cuentas.FirstOrDefault(c => c.numero_cuenta == cuenta.numero_cuenta);

            if (tipo == "nuevo")
            {
                if (existingAccount != null)
                {
                    return Conflict("La cuenta ya existe");
                }

                // Generate a unique 8-digit account number if numero_cuenta is 0
                if (cuenta.numero_cuenta == 0)
                {
                    var random = new Random();
                    do
                    {
                        cuenta.numero_cuenta = random.Next(10000000, 99999999); // Generate 8-digit number
                    } while (cuentas.Any(c => c.numero_cuenta == cuenta.numero_cuenta));
                }

                // Validar existencia del cliente
                var clientes = _clienteService.GetAll();
                var clienteExistente = clientes.Any(c => c.cedula == cuenta.cedula);
                if (!clienteExistente)
                {
                    return NotFound($"No existe un cliente con cédula = {cuenta.cedula}");
                }

                // Validar existencia de la moneda
                var monedas = _monedaService.GetAll();
                var monedaExistente = monedas.Any(m => m.moneda == cuenta.id_moneda);
                if (!monedaExistente)
                {
                    return NotFound($"No existe una moneda con el código {cuenta.id_moneda}");
                }

                // Validar existencia del tipo de cuenta
                var tiposCuentas = _tipoCuentaService.GetAll();
                var tipoCuentaExistente = tiposCuentas.Any(tc => tc.tipo_cuenta == cuenta.id_tipo_cuenta);
                if (!tipoCuentaExistente)
                {
                    return NotFound($"No existe un tipo de cuenta con el código {cuenta.id_tipo_cuenta}");
                }

                _cuentaService.Add(cuenta);
                return CreatedAtAction(nameof(agregar_cuenta), new { id = cuenta.numero_cuenta }, cuenta);
            }
            else if (tipo == "editar")
            {
                if (existingAccount == null)
                {
                    return NotFound("La cuenta no existe para editar");
                }

                existingAccount.descripcion = cuenta.descripcion;
                existingAccount.monto = cuenta.monto;
                existingAccount.id_tipo_cuenta = cuenta.id_tipo_cuenta;
                existingAccount.id_moneda = cuenta.id_moneda;
                _cuentaService.Update(existingAccount);
                return Ok(existingAccount);
            }
            else if (tipo == "borrar")
            {
                if (existingAccount == null)
                {
                    return NotFound("La cuenta no existe para borrar");
                }

                _cuentaService.Delete(existingAccount);
                return Ok("La cuenta ha sido borrada exitosamente");
            }

            return BadRequest("Operación no válida");
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
