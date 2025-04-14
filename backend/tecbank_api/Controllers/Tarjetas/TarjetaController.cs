using Microsoft.AspNetCore.Mvc;
using tecbank_api.Models;
using tecbank_api.Models.Clientes_Cuentas;
using tecbank_api.Services;

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
        private readonly JsonDataService<Tarjeta> _tarjetaService;
        private readonly JsonDataService<Cuenta> _cuentaService;
        private readonly JsonDataService<Tipo_Tarjeta> _tipoTarjetaService;
        private readonly JsonDataService<Cliente> _clienteService;
        public TarjetaController()
        {
            _tarjetaService = new JsonDataService<Tarjeta>("Data/tarjetas.json");
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
            Registra una nueva tarjeta después de validar la existencia del cliente, tipo de tarjeta y la duplicidad de la tarjeta.

        Params:
            - tarjeta (Tarjeta): El objeto tarjeta que contiene la información de la tarjeta a agregar.

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado 201 (Created) y la tarjeta recién creada en formato JSON.

        Restriction:
            Depende de los servicios `ClienteService`, `TipoTarjetaService` y `TarjetaService` para realizar las validaciones necesarias y agregar la tarjeta.

        Problems:
            - Ningún problema conocido durante la implementación de este método.

        References:
            N/A
        */
        [HttpPost]
        public IActionResult Post([FromBody] Tarjeta tarjeta)
        {
            if (tarjeta == null)
            {
                return BadRequest("La tarjeta no puede ser nula");
            }
            // Validar existencia del cliente
            var clientes = _clienteService.GetAll();
            var clienteExistente = clientes.Any(c => c.id_cliente == tarjeta.id_cliente);
            if (!clienteExistente)
            {
                return NotFound($"No existe un cliente con id_cliente = {tarjeta.id_cliente}");
            }
            // Validar existencia del tipo de tarjeta
            var tiposTarjeta = _tipoTarjetaService.GetAll();
            var tipoTarjetaExistente = tiposTarjeta.Any(t => t.tipo_tarjeta == tarjeta.id_tipo_tarjeta);
            if (!tipoTarjetaExistente)
            {
                return NotFound($"No existe un tipo de tarjeta con el código {tarjeta.id_tipo_tarjeta}");
            }

            // Validar la duplicidad de la tarjeta
            var tarjetas = _tarjetaService.GetAll();
            var tarjetaExistente = tarjetas.Any(t => t.numero_tarjeta == tarjeta.numero_tarjeta);
            if (tarjetaExistente)
            {
                return Conflict($"Ya existe una tarjeta con el número {tarjeta.numero_tarjeta}");
            }

            _tarjetaService.Add(tarjeta);
            return CreatedAtAction(nameof(Post), new { id = tarjeta.numero_tarjeta }, tarjeta);
        }

    }
}
