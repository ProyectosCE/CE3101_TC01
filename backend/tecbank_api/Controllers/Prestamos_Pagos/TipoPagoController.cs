using Microsoft.AspNetCore.Mvc;
using tecbank_api.Models.Prestamos_Pagos;
using tecbank_api.Services;

namespace tecbank_api.Controllers.Prestamos_Pagos
{
    /* Class: TipoPagoController
        Controlador de API que maneja las solicitudes relacionadas con los tipos de pago disponibles para préstamos.

    Attributes:
        - _tipoPagoService: JsonDataService<Tipo_Pago> - Servicio para manejar los datos de tipo de pago, basado en un archivo JSON.

    Constructor:
        - TipoPagoController: Constructor predeterminado que inicializa el servicio `JsonDataService<Tipo_Pago>` con la ruta al archivo JSON "Data/tipo_pagos.json".

    Methods:
        - Get: Método que maneja las solicitudes GET a la API para obtener todos los tipos de pago.
          Tipo: IActionResult  
          Descripción: Retorna todos los tipos de pago almacenados en el archivo JSON como respuesta de la API.

    Example:
        // Envío de una solicitud GET a la ruta /api/tipopago
        GET /api/tipopago

    Problems:
        Ningún problema conocido durante la implementación de este controlador.

    References:
        N/A
    */

    [ApiController]
    [Route("api/[controller]")]
    public class TipoPagoController : ControllerBase
    {
        private readonly JsonDataService<Tipo_Pago> _tipoPagoService;
        public TipoPagoController()
        {
            _tipoPagoService = new JsonDataService<Tipo_Pago>("Data/tipo_pagos.json");
        }

        /* Function: Get
            Recupera todos los tipos de pago registrados y los devuelve en formato JSON.

        Params:
            - N/A

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado 200 (OK) y los tipos de pago en formato JSON.

        Restriction:
            Depende del servicio `TipoPagoService` para recuperar los datos desde la fuente correspondiente.

        Problems:
            - Ningún problema conocido durante la implementación de este método.

        References:
            N/A
        */
        [HttpGet]
        public IActionResult Get()
        {
            var tiposPago = _tipoPagoService.GetAll();
            return Ok(tiposPago);
        }
    }
}
