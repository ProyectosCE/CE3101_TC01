using Microsoft.AspNetCore.Mvc;
using tecbank_api.Models.Clientes_Cuentas;
using tecbank_api.Services;

namespace tecbank_api.Controllers.Clientes_Cuentas
{
    /* Class: TipoCuentaController
        Controlador para obtener los tipos de cuenta disponibles en el sistema (ej. AHORROS, CORRIENTE).

    Attributes:
        - _tipoCuentaService: JsonDataService<Tipo_Cuenta> - Servicio para acceder a los tipos de cuenta almacenados.

    Constructor:
        - TipoCuentaController: Inicializa el servicio con el archivo JSON correspondiente.

    Methods:
        - Get():
            Retorna la lista de tipos de cuenta disponibles.
            Endpoint: GET /api/tipocuenta

    References:
        - N/A
    */

    [ApiController]
    [Route("api/[controller]")]
    public class TipoCuentaController : ControllerBase
    {
        private readonly JsonDataService<Tipo_Cuenta> _tipoCuentaService;

        public TipoCuentaController()
        {
            _tipoCuentaService = new JsonDataService<Tipo_Cuenta>("Data/tipo_cuentas.json");
        }

        /* Function: Get
            Recupera todos los tipos de cuenta disponibles y devuelve los datos en formato JSON.

        Params:
            - N/A

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado 200 (OK) y los datos de los tipos de cuenta en formato JSON.

        Restriction:
            Depende del servicio `JsonDataService<Tipo_Cuenta>` para recuperar los datos desde el archivo JSON de tipos de cuenta.

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
        */
        [HttpGet]
        public IActionResult Get()
        {
            var tiposCuenta = _tipoCuentaService.GetAll()
                .Where(tc => tc.tipo_cuenta != "TCREDITO") // Exclude "TCREDITO"
                .ToList();
            return Ok(tiposCuenta);
        }
    }
}
