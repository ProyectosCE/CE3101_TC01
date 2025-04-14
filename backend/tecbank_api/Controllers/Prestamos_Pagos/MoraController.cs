using Microsoft.AspNetCore.Mvc;
using tecbank_api.Models;
using tecbank_api.Models.Clientes_Cuentas;
using tecbank_api.Models.Prestamos_Pagos;
using tecbank_api.Services;

namespace tecbank_api.Controllers.Prestamos_Pagos
{
    /* Class: MoraController
    Controlador de API encargado de gestionar las moras asociadas a los préstamos. Permite consultar y registrar nuevas moras con validaciones de existencia de préstamos y clientes.

    Attributes:
        - _moraService: JsonDataService<Mora> - Servicio para manejar los datos de moras.
        - _prestamoService: JsonDataService<Prestamo> - Servicio para acceder a préstamos existentes.
        - _clienteService: JsonDataService<Cliente> - Servicio para acceder a clientes existentes.

    Constructor:
        - MoraController: Constructor que inicializa los servicios para acceder y gestionar moras, préstamos y clientes.

    Methods:
        - Get: Método que maneja solicitudes GET para obtener todas las moras registradas.
          Tipo: IActionResult  
          Descripción: Retorna la lista completa de moras almacenadas.

        - Post: Método que maneja solicitudes POST para registrar una nueva mora.
          Tipo: IActionResult  
          Parámetro: [FromBody] Mora mora - Objeto mora enviado en el cuerpo de la solicitud.
          Descripción:
            - Verifica si la mora ya existe según su `id_mora`.
            - Valida la existencia del préstamo referenciado por `id_prestamo`.
            - Valida la existencia del cliente relacionado al préstamo.
            - Agrega los datos del cliente (cédula, nombre completo) al objeto de mora antes de guardarlo.
            - Asigna un nuevo `id_mora` incremental.

    Example:
        // Registrar nueva mora
        POST /api/mora

    Problems:
        - No se verifica si la mora ya fue pagada o compensada.
        - No hay verificación de fechas duplicadas para un mismo préstamo.
        - No se notifica automáticamente al cliente o al sistema sobre la mora registrada.

    References:
        N/A
    */

    [ApiController]
    [Route("api/[controller]")]
    public class MoraController : ControllerBase
    {
        private readonly JsonDataService<Mora> _moraService;
        private readonly JsonDataService<Prestamo> _prestamoService;
        private readonly JsonDataService<Cliente> _clienteService;

        public MoraController()
        {
            _moraService = new JsonDataService<Mora>("Data/moras.json");
            _prestamoService = new JsonDataService<Prestamo>("Data/prestamos.json");
            _clienteService = new JsonDataService<Cliente>("Data/clientes.json");

        }

        /* Function: Get
            Recupera todas las moras registradas y las devuelve en formato JSON.

        Params:
            - N/A

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado 200 (OK) y las moras en formato JSON.

        Restriction:
            Depende del servicio `JsonDataService<Mora>` para recuperar los datos desde el archivo JSON de moras.

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
        */
        [HttpGet]
        public IActionResult Get()
        {
            var moras = _moraService.GetAll();
            return Ok(moras);
        }

        /* Function: Post
            Crea una nueva mora. Valida que la mora no sea nula, que no exista una mora con el mismo ID, que el préstamo asociado exista, y que el cliente asociado al préstamo exista. Luego, agrega la mora a la lista y la guarda.

        Params:
            - mora: Objeto `Mora` que contiene los datos de la mora a crear.

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado 201 (Created) si la mora se creó correctamente, o un código de error (BadRequest, Conflict, NotFound) si se encuentra algún problema con los datos proporcionados.

        Restriction:
            Depende del servicio `JsonDataService<Mora>` para agregar la mora a la lista, `JsonDataService<Prestamo>` para validar la existencia del préstamo, y `JsonDataService<Cliente>` para validar la existencia del cliente.

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
        */
        [HttpPost]
        public IActionResult Post([FromBody] Mora mora)
        {
            if (mora == null)
            {
                return BadRequest("La mora no puede ser nula");
            }

            // Validar si ya existe la mora
            var moras = _moraService.GetAll();
            var existingMora = moras.FirstOrDefault(m => m.id_mora == mora.id_mora);
            if (existingMora != null)
            {
                return Conflict("La mora ya existe");
            }

            // Validar existencia del prestamo
            var prestamos = _prestamoService.GetAll();
            var prestamoExistente = prestamos.FirstOrDefault(p => p.id_prestamo == mora.id_prestamo);
            if (prestamoExistente == null)
            {
                return NotFound($"No existe un prestamo con el ID {mora.id_prestamo}");
            }

            // Validar existencia del cliente
            var clientes = _clienteService.GetAll();
            var clienteExistente = clientes.FirstOrDefault(c => c.id_cliente == prestamoExistente.id_cliente);
            if (clienteExistente == null)
            {
                return NotFound($"No existe un cliente con el ID {prestamoExistente.id_cliente}");
            }

            // Agregar datos adicionales
            mora.cedula = clienteExistente.cedula;
            mora.nombre_completo = clienteExistente.nombre_completo;
            mora.id_mora = moras.Any() ? moras.Max(m => m.id_mora) + 1 : 1; // Incrementar el id_mora previo


            _moraService.Add(mora);
            return CreatedAtAction(nameof(Post), new { id = mora.id_mora }, mora);
        }

        /* Function: GetMorasByPrestamo
            Recupera todas las moras asociadas a un préstamo específico.

        Params:
            - id_prestamo: int - ID del préstamo para el cual se desean obtener las moras.

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado 200 (OK) y las moras asociadas al préstamo en formato JSON, o un código de error (NotFound) si no se encuentran moras para el préstamo especificado.

        Restriction:
            Depende del servicio `JsonDataService<Mora>` para recuperar los datos desde el archivo JSON de moras.

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
        */
        [HttpGet("{id_prestamo}")]
        public IActionResult GetMorasByPrestamo(int id_prestamo)
        {
            var moras = _moraService.GetAll();
            var morasPrestamo = moras.Where(m => m.id_prestamo == id_prestamo).ToList();
            if (morasPrestamo.Count == 0)
            {
                return NotFound($"No se encontraron moras para el prestamo con ID {id_prestamo}");
            }
            return Ok(morasPrestamo);
        }
    }
}
