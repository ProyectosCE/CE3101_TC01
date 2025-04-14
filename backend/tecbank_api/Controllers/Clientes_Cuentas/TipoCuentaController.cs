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

/* Class: TipoCuentaController
Controlador para obtener los tipos de cuenta disponibles en el sistema (ej. AHORROS, CORRIENTE).

Attributes:
- _tipoCuentaService: JsonDataService<Tipo_Cuenta> - Servicio para acceder a los tipos de cuenta almacenados.

Constructor:
- TipoCuentaController: Inicializa el servicio con el archivo JSON correspondiente.

Methods:
- Get: Retorna la lista de tipos de cuenta disponibles.

Example:
    var controller = new TipoCuentaController();
    var tipos = controller.Get();
*/

using Microsoft.AspNetCore.Mvc;
using tecbank_api.Models.Clientes_Cuentas;
using tecbank_api.Services;

namespace tecbank_api.Controllers.Clientes_Cuentas
{
    [ApiController]
    [Route("api/[controller]")]
    public class TipoCuentaController : ControllerBase
    {
        // Servicio para acceder a los tipos de cuenta.
        private readonly JsonDataService<Tipo_Cuenta> _tipoCuentaService;

        // Constructor: Inicializa el servicio con el archivo JSON.
        public TipoCuentaController()
        {
            _tipoCuentaService = new JsonDataService<Tipo_Cuenta>("Data/tipo_cuentas.json");
        }

        /* Function: Get
        Recupera todos los tipos de cuenta disponibles y devuelve los datos en formato JSON.

        Params:
        - Ninguno.

        Returns:
        - IActionResult: HTTP 200 (OK) con los tipos de cuenta.

        Restriction:
        Excluye el tipo "TCREDITO" de la respuesta.
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
