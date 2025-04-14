using Microsoft.AspNetCore.Mvc;
using tecbank_api.Models;
using tecbank_api.Services;

namespace tecbank_api.Controllers.Tarjetas
{
    /* Class: TipoTarjetaController
    Controlador de API que maneja las solicitudes relacionadas con los tipos de tarjeta.

    Attributes:
    - _tipoTarjetaService: JsonDataService<Tipo_Tarjeta> - Servicio para manejar los datos de tipo de tarjeta, basado en un archivo JSON.

    Constructor:
    - TipoTarjetaController: Constructor predeterminado que inicializa el servicio `JsonDataService<Tipo_Tarjeta>` con la ruta al archivo JSON "Data/tipo_tarjetas.json".

    Methods:
    - Get: Método que maneja las solicitudes GET a la API para obtener todos los tipos de tarjeta.
        Tipo: IActionResult  
        Descripción: Retorna todos los tipos de tarjeta almacenados en el archivo JSON como respuesta de la API.

    Example:
    // Envío de una solicitud GET a la ruta /api/tipotarjeta
    GET /api/tipotarjeta

    Problems:
    Ningún problema conocido durante la implementación de este controlador.

    References:
    N/A
    */
    [ApiController]
    [Route("api/[controller]")]
    public class TipoTarjetaController : ControllerBase
    {
        private readonly JsonDataService<Tipo_Tarjeta> _tipoTarjetaService;
        public TipoTarjetaController()
        {
            _tipoTarjetaService = new JsonDataService<Tipo_Tarjeta>("Data/tipo_tarjetas.json");
        }

        /* Function: Get
            Recupera todos los tipos de tarjeta registrados y los devuelve en formato JSON.

        Params:
            - N/A

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado 200 (OK) y los tipos de tarjeta en formato JSON.

        Restriction:
            Depende del servicio `TipoTarjetaService` para recuperar los datos desde la fuente correspondiente.

        Problems:
            - Ningún problema conocido durante la implementación de este método.

        References:
            N/A
        */
        [HttpGet]
        public IActionResult Get()
        {
            var tiposTarjeta = _tipoTarjetaService.GetAll();
            return Ok(tiposTarjeta);
        }
    }
}
