using Microsoft.AspNetCore.Mvc;
using tecbank_api.Models.Clientes_Cuentas;
using tecbank_api.Services;

namespace tecbank_api.Controllers.Clientes_Cuentas
{
    /* Class: TipoTransaccionController
        Controlador para obtener los tipos de transacción disponibles en el sistema (ej. DEPÓSITO, RETIRO, TRANSFERENCIA, COMPRA).

    Attributes:
        - _tipoTransaccionService: JsonDataService<Tipo_Transaccion> - Servicio para acceder a los tipos de transacción almacenados.

    Constructor:
        - TipoTransaccionController: Inicializa el servicio con el archivo JSON correspondiente.

    Methods:
        - Get():
            Retorna la lista de tipos de transacción disponibles.
            Endpoint: GET /api/tipotransaccion

    References:
        - N/A
    */

    [ApiController]
    [Route("api/[controller]")]
    public class TipoTransaccionController : ControllerBase
    {
        private readonly JsonDataService<Tipo_Transaccion> _tipoTransaccionService;
        public TipoTransaccionController()
        {
            _tipoTransaccionService = new JsonDataService<Tipo_Transaccion>("Data/tipo_transacciones.json");
        }

        /* Function: Get
            Recupera todos los tipos de transacción disponibles y devuelve los datos en formato JSON.

        Params:
            - N/A

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado 200 (OK) y los datos de los tipos de transacción en formato JSON.

        Restriction:
            Depende del servicio `JsonDataService<Tipo_Transaccion>` para recuperar los datos desde el archivo JSON de tipos de transacción.

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
        */
        [HttpGet]
        public IActionResult Get()
        {
            var tiposTransaccion = _tipoTransaccionService.GetAll();
            return Ok(tiposTransaccion);
        }
    }
}
