using Microsoft.AspNetCore.Mvc;
using tecbank_api.Models.Clientes_Cuentas;
using tecbank_api.Services;

namespace tecbank_api.Controllers.Clientes_Cuentas
{

    /* Class: TipoClienteController
        Controlador de API que maneja las solicitudes relacionadas con los tipos de cliente.

    Attributes:
        - _tipoClienteService: JsonDataService<Tipo_Cliente> - Servicio para manejar los datos de tipo de cliente, basado en un archivo JSON.

    Constructor:
        - TipoClienteController: Constructor predeterminado que inicializa el servicio `JsonDataService<Tipo_Cliente>` con la ruta al archivo JSON "Data/tipo_clientes.json".

    Methods:
        - Get: Método que maneja las solicitudes GET a la API para obtener todos los tipos de cliente.
        Tipo: IActionResult
        Descripción: Retorna todos los tipos de cliente almacenados en el archivo JSON como respuesta de la API.

    Example:
        // Envío de una solicitud GET a la ruta /api/tipocliente
        GET /api/tipocliente

    Problems:
        Ningún problema conocido durante la implementación de este controlador.

    References:
        N/A
    */
    [ApiController]
    [Route("api/[controller]")]
    public class TipoClienteController : ControllerBase
    {
        private readonly JsonDataService<Tipo_Cliente> _tipoClienteService;

        public TipoClienteController()
        {
            _tipoClienteService = new JsonDataService<Tipo_Cliente>("Data/tipo_clientes.json");
        }


        /* Function: Get
            Recupera todos los tipos de cliente desde el servicio y devuelve la lista como respuesta de la API.

        Params:
            - N/A

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado 200 (OK) junto con la lista de tipos de cliente.

        Restriction:
            El método depende del servicio `JsonDataService<Tipo_Cliente>` para recuperar los datos desde el archivo JSON.

        Example:
            // Envío de una solicitud GET a la ruta /api/tipocliente
            GET /api/tipocliente

            Respuesta:
            [
            { "tipo": "FISICO", "descripcion": "Persona fisica con cedula nacional" },
            { "tipo": "JURIDICO", "descripcion": "Entidad juridica como empresa o sociedad" }
            ]

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
        */
        [HttpGet]
        public IActionResult Get()
        {
            var tipos = _tipoClienteService.GetAll();
            return Ok(tipos);
        }
    }
}
