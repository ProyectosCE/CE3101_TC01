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

using Microsoft.AspNetCore.Mvc;
using tecbank_api.Services;
using tecbank_api.Models.Clientes_Cuentas;

/* Class: CuentaController
Controlador para la gestión de cuentas bancarias, que permite obtener, agregar, editar, borrar cuentas y consultar el saldo de una cuenta.

Attributes:
- _cuentaService: JsonDataService<Cuenta> - Servicio para acceder a las cuentas bancarias.
- _clienteService: JsonDataService<Cliente> - Servicio para acceder a los clientes.
- _monedaService: JsonDataService<Moneda> - Servicio para acceder a las monedas.
- _tipoCuentaService: JsonDataService<Tipo_Cuenta> - Servicio para acceder a los tipos de cuentas.

Constructor:
- CuentaController: Inicializa los servicios con los archivos JSON correspondientes.

Methods:
- Get: Retorna la lista de todas las cuentas o las cuentas asociadas a una cédula.
- agregar_cuenta: Permite agregar, editar o borrar una cuenta.
- obtener_saldo: Retorna el saldo de una cuenta específica.
- GetCuentas: Retorna todas las cuentas asociadas a una cédula.
- GetCuentaInfo: Retorna la información de una cuenta específica.

Example:
    var controller = new CuentaController();
    var cuentas = controller.Get("all");
    controller.agregar_cuenta(new Cuenta { ... }, "nuevo");
*/
namespace tecbank_api.Controllers.Clientes_Cuentas
{
    [ApiController]
    [Route("api/[controller]")]
    public class CuentaController : ControllerBase
    {
        // Servicios para cuentas, clientes, monedas y tipos de cuenta
        private readonly JsonDataService<Cuenta> _cuentaService;
        private readonly JsonDataService<Cliente> _clienteService;
        private readonly JsonDataService<Moneda> _monedaService;
        private readonly JsonDataService<Tipo_Cuenta> _tipoCuentaService;

        // Constructor: Inicializa los servicios con los archivos JSON.
        public CuentaController()
        {
            _cuentaService = new JsonDataService<Cuenta>("Data/cuentas.json");
            _clienteService = new JsonDataService<Cliente>("Data/clientes.json");
            _monedaService = new JsonDataService<Moneda>("Data/monedas.json");
            _tipoCuentaService = new JsonDataService<Tipo_Cuenta>("Data/tipo_cuentas.json");
        }

        /* Function: Get
        Recupera todas las cuentas bancarias o las cuentas asociadas a una cédula específica.

        Params:
        - tipo: string - "all" para todas las cuentas o cédula para cuentas asociadas.

        Returns:
        - IActionResult: HTTP 200 (OK) con las cuentas, o 404 si no existen para la cédula.

        Restriction:
        Depende del servicio de cuentas.
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
        - cuenta: Cuenta - Objeto que representa la cuenta.
        - tipo: string - "nuevo", "editar" o "borrar".

        Returns:
        - IActionResult: HTTP 201 (Created), 200 (OK), 400 (BadRequest), 404 (NotFound) o 409 (Conflict) según el resultado.

        Restriction:
        Depende de los servicios de cliente, moneda y tipo de cuenta.
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

                // Generar número de cuenta único de 8 dígitos si es 0
                if (cuenta.numero_cuenta == 0)
                {
                    var random = new Random();
                    do
                    {
                        cuenta.numero_cuenta = random.Next(10000000, 99999999);
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
        - numeroCuenta: int - Número de la cuenta.

        Returns:
        - IActionResult: HTTP 200 (OK) con el saldo, o 404 si no existe.

        Restriction:
        Depende del servicio de cuentas.
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

        /* Function: GetCuentas
        Recupera todas las cuentas asociadas a una cédula.

        Params:
        - cedula: string - Cédula del cliente.

        Returns:
        - IActionResult: HTTP 200 (OK) con las cuentas, o 404 si no existen.

        Restriction:
        El parámetro cedula es requerido.
        */
        [HttpGet("Cuentas")]
        public IActionResult GetCuentas([FromQuery] string cedula)
        {
            if (string.IsNullOrEmpty(cedula))
            {
                return BadRequest("El número de cédula es requerido");
            }

            var cuentas = _cuentaService.GetAll()
                .Where(c => c.cedula == cedula)
                .ToList();

            if (!cuentas.Any())
            {
                return NotFound($"No se encontraron cuentas para la cédula {cedula}");
            }

            return Ok(cuentas);
        }

        /* Function: GetCuentaInfo
        Recupera la información de una cuenta específica.

        Params:
        - numCuenta: int - Número de la cuenta.

        Returns:
        - IActionResult: HTTP 200 (OK) con la cuenta, o 404 si no existe.

        Restriction:
        La cuenta debe existir.
        */
        [HttpGet("cuentaInfo/{numCuenta}")]
        public IActionResult GetCuentaInfo(int numCuenta)
        {
            var cuenta = _cuentaService.GetAll()
                .FirstOrDefault(c => c.numero_cuenta == numCuenta);

            if (cuenta == null)
            {
                return NotFound($"No se encontró la cuenta con número {numCuenta}.");
            }

            return Ok(cuenta);
        }
    }
}
