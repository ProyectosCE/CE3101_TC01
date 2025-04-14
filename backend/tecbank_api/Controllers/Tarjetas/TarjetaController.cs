using Microsoft.AspNetCore.Mvc;
using tecbank_api.Models;
using tecbank_api.Models.Clientes_Cuentas;
using tecbank_api.Services;
using TarjetaModel = tecbank_api.Models.Tarjeta; // Alias for tecbank_api.Models.Tarjeta

namespace tecbank_api.Controllers.Tarjetas
{
    /* Class: TarjetaController
        Controlador de API que maneja las solicitudes relacionadas con las tarjetas bancarias.

    Attributes:
        - _tarjetaService: JsonDataService<Tarjeta> - Servicio para manejar los datos de tarjetas.
        - _cuentaService: JsonDataService<Cuenta> - Servicio para manejar los datos de cuentas bancarias.
        - _tipoTarjetaService: JsonDataService<Tipo_Tarjeta> - Servicio para manejar los tipos de tarjeta.
        - _clienteService: JsonDataService<Cliente> - Servicio para manejar los datos de clientes.

    Constructor:
        - TarjetaController: Constructor predeterminado que inicializa los servicios de acceso a archivos JSON correspondientes a tarjetas, cuentas, tipos de tarjeta y clientes.

    Methods:
        - Get: Método que maneja las solicitudes GET a la API para obtener todas las tarjetas registradas.
          Tipo: IActionResult  
          Descripción: Retorna todas las tarjetas almacenadas en el archivo JSON como respuesta de la API.

        - Post: Método que maneja las solicitudes POST para agregar una nueva tarjeta.
          Tipo: IActionResult  
          Parámetro: [FromBody] Tarjeta tarjeta - Objeto tarjeta enviado en el cuerpo de la solicitud.
          Descripción:
            Valida la existencia del cliente y del tipo de tarjeta antes de agregar una nueva tarjeta al archivo JSON.
            Retorna un error si el cliente o el tipo de tarjeta no existen.

    Example:
        // Envío de una solicitud GET a la ruta /api/tarjeta
        GET /api/tarjeta

        // Envío de una solicitud POST con una nueva tarjeta
        POST /api/tarjeta

    Problems:
        - Se debe validar que el cliente y el tipo de tarjeta existan antes de registrar una nueva tarjeta.

    References:
        N/A
    */

    [ApiController]
    [Route("api/[controller]")]
    public class TarjetaController : ControllerBase
    {
        private readonly JsonDataService<TarjetaModel> _tarjetaService;
        private readonly JsonDataService<Cuenta> _cuentaService;
        private readonly JsonDataService<Tipo_Tarjeta> _tipoTarjetaService;
        private readonly JsonDataService<Cliente> _clienteService;
        public TarjetaController()
        {
            _tarjetaService = new JsonDataService<TarjetaModel>("Data/tarjetas.json");
            _cuentaService = new JsonDataService<Cuenta>("Data/cuentas.json");
            _tipoTarjetaService = new JsonDataService<Tipo_Tarjeta>("Data/tipo_tarjetas.json");
            _clienteService = new JsonDataService<Cliente>("Data/clientes.json");

        }

        /* Function: Get
            Recupera todas las tarjetas registradas y las devuelve en formato JSON.

        Params:
            - N/A

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado 200 (OK) y las tarjetas en formato JSON.

        Restriction:
            Depende del servicio `TarjetaService` para recuperar los datos desde la fuente correspondiente.

        Problems:
            - Ningún problema conocido durante la implementación de este método.

        References:
            N/A
        */
        [HttpGet]
        public IActionResult Get()
        {
            var tarjetas = _tarjetaService.GetAll();
            return Ok(tarjetas);
        }

        /* Function: Post
            Maneja las operaciones de "nuevo", "editar" y "eliminar" para las tarjetas.

        Params:
            - tarjeta (Tarjeta): El objeto tarjeta que contiene la información de la tarjeta.
            - tipo (string): El tipo de operación a realizar ("nuevo", "editar", "eliminar").

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el resultado de la operación.

        Restriction:
            Depende de los servicios `ClienteService`, `TipoTarjetaService` y `TarjetaService` para realizar las validaciones necesarias y manejar las tarjetas.

        Problems:
            - Ningún problema conocido durante la implementación de este método.

        References:
            N/A
        */
        [HttpPost]
        public IActionResult Post([FromBody] TarjetaModel tarjeta, [FromQuery] string tipo)
        {
            if (tarjeta == null)
            {
                return BadRequest("La tarjeta no puede ser nula.");
            }

            if (string.IsNullOrEmpty(tipo) || (tipo != "nuevo" && tipo != "editar" && tipo != "eliminar"))
            {
                return BadRequest("El tipo debe ser 'nuevo', 'editar' o 'eliminar'.");
            }

            var tarjetas = _tarjetaService.GetAll();

            if (tipo == "nuevo")
            {
                // Validate cuenta existence
                var cuenta = _cuentaService.GetAll().FirstOrDefault(c => c.numero_cuenta == tarjeta.numero_cuenta);
                if (cuenta == null)
                {
                    return NotFound($"No existe una cuenta con el número {tarjeta.numero_cuenta}.");
                }

                // Validate cliente existence
                var cliente = _clienteService.GetAll().FirstOrDefault(c => c.cedula == tarjeta.cedula);
                if (cliente == null)
                {
                    return NotFound($"No existe un cliente con la cédula {tarjeta.cedula}.");
                }

                // Auto-generate card details
                tarjeta.numero_tarjeta = GenerarNumeroTarjetaLuhn(tarjeta.marca);
                if (tarjeta.numero_tarjeta == null)
                {
                    return BadRequest("La marca de tarjeta no es válida. Debe ser 'Visa', 'Mastercard' o 'Amex'.");
                }

                tarjeta.cvc = new Random().Next(100, 999); // Generate a random 3-digit CVC
                tarjeta.fecha_vencimiento = DateOnly.FromDateTime(DateTime.Now.AddYears(3)); // Set expiration date to 3 years from now

                _tarjetaService.Add(tarjeta);
                return CreatedAtAction(nameof(Post), new { id = tarjeta.numero_tarjeta }, tarjeta);
            }
            else if (tipo == "editar")
            {
                var tarjetaExistente = tarjetas.FirstOrDefault(t => t.numero_tarjeta == tarjeta.numero_tarjeta);
                if (tarjetaExistente == null)
                {
                    return NotFound("La tarjeta no existe para editar.");
                }

                tarjetaExistente.marca = tarjeta.marca;
                tarjetaExistente.tipo = tarjeta.tipo;
                tarjetaExistente.numero_cuenta = tarjeta.numero_cuenta;
                tarjetaExistente.id_tipo_tarjeta = tarjeta.id_tipo_tarjeta;
                tarjetaExistente.monto_disponible = tarjeta.monto_disponible;
                _tarjetaService.Update(tarjetaExistente);
                return Ok(tarjetaExistente);
            }
            else if (tipo == "eliminar")
            {
                var tarjetaExistente = tarjetas.FirstOrDefault(t => t.numero_tarjeta == tarjeta.numero_tarjeta);
                if (tarjetaExistente == null)
                {
                    return NotFound("La tarjeta no existe para eliminar.");
                }

                _tarjetaService.Delete(tarjetaExistente);
                return Ok("La tarjeta ha sido eliminada exitosamente.");
            }

            return BadRequest("Operación no válida.");
        }

        private string GenerarNumeroTarjetaLuhn(string marca)
        {
            string prefix = marca switch
            {
                "Visa" => "4",
                "Mastercard" => "5",
                "Amex" => "34",
                _ => null
            };

            if (prefix == null) return null;

            var random = new Random();
            string numeroBase = prefix + string.Concat(Enumerable.Range(0, 15 - prefix.Length)
                .Select(_ => random.Next(0, 10).ToString()));

            int sum = 0;
            bool alternate = true;
            for (int i = numeroBase.Length - 1; i >= 0; i--)
            {
                int n = int.Parse(numeroBase[i].ToString());
                if (alternate)
                {
                    n *= 2;
                    if (n > 9) n -= 9;
                }
                sum += n;
                alternate = !alternate;
            }

            int checkDigit = (10 - (sum % 10)) % 10;
            return numeroBase + checkDigit;
        }

        [HttpPost("asignarTarjeta")]
        public IActionResult AsignarTarjeta([FromBody] TarjetaModel tarjeta)
        {
            if (tarjeta == null)
            {
                return BadRequest("La tarjeta no puede ser nula.");
            }

            // Validar existencia del cliente
            var clientes = _clienteService.GetAll();
            var clienteExistente = clientes.FirstOrDefault(c => c.cedula == tarjeta.cedula);
            if (clienteExistente == null)
            {
                return NotFound($"No existe un cliente con la cédula {tarjeta.cedula}");
            }

            // Guardar la tarjeta
            _tarjetaService.Add(tarjeta);
            return CreatedAtAction(nameof(AsignarTarjeta), new { id = tarjeta.numero_tarjeta }, tarjeta);
        }

        [HttpGet("consultarTarjetas/{cedula}")]
        public IActionResult ConsultarTarjetas(string cedula)
        {
            var tarjetas = _tarjetaService.GetAll()
                .Where(t => t.cedula == cedula)
                .ToList();

            return Ok(tarjetas);
        }

        [HttpGet("tarjetas/{numeroCuenta}")]
        public IActionResult GetTarjetasPorCuenta(int numeroCuenta)
        {
            // Verificar si la cuenta existe
            var cuenta = _cuentaService.GetAll().FirstOrDefault(c => c.numero_cuenta == numeroCuenta);
            if (cuenta == null)
            {
                return NotFound($"No existe una cuenta con el número {numeroCuenta}.");
            }

            // Obtener todas las tarjetas asociadas a esa cuenta
            var tarjetas = _tarjetaService.GetAll()
                .Where(t => t.numero_cuenta == numeroCuenta)
                .ToList();

            return Ok(tarjetas);
        }
    }
}
