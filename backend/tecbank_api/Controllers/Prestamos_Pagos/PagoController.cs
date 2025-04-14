using Microsoft.AspNetCore.Mvc;
using tecbank_api.Models.Prestamos_Pagos;
using tecbank_api.Models.Clientes_Cuentas;
using tecbank_api.Services;

namespace tecbank_api.Controllers.Prestamos_Pagos
{
    /* Class: PagoController
    Controlador de API encargado de gestionar los pagos realizados a los préstamos, incluyendo su validación, registro y consulta.

    Attributes:
        - _pagoService: JsonDataService<Pago> - Servicio para manejar los datos de pagos.
        - _prestamoService: JsonDataService<Prestamo> - Servicio para manejar los datos de préstamos.
        - _tipoPagoService: JsonDataService<Tipo_Pago> - Servicio para manejar los datos de tipos de pago.

    Constructor:
        - PagoController: Constructor predeterminado que inicializa los servicios necesarios para acceder y gestionar los pagos, préstamos y tipos de pago.

    Methods:
        - Get: Método que maneja solicitudes GET para obtener todos los pagos registrados.
          Tipo: IActionResult  
          Descripción: Retorna la lista completa de pagos almacenados.

        - Post: Método que maneja solicitudes POST para registrar un nuevo pago.
          Tipo: IActionResult  
          Parámetro: [FromBody] Pago pago - Objeto pago enviado en el cuerpo de la solicitud.
          Descripción:
            Valida que el préstamo y el tipo de pago existan antes de registrar el pago.

        - RealizarPago: Método para registrar un nuevo pago mediante parámetros de consulta.
          Tipo: IActionResult  
          Parámetros:
            - int id_prestamo: ID del préstamo asociado al pago.
            - double monto: Monto del pago realizado.
            - string tipo: Tipo de pago (corresponde al `id_tipo_pago`).
          Descripción:
            Valida la existencia del préstamo y del tipo de pago. Crea y guarda un nuevo objeto `Pago` con la fecha actual.

    Example:
        // Registrar un pago mediante JSON
        POST /api/pago

        // Realizar pago directo por query
        POST /api/pago/realizarPago?id_prestamo=1&monto=150.00&tipo=EXTRAORDINARIO

    Problems:
        - No se actualiza el saldo del préstamo asociado.
        - No se distingue aún entre pagos ordinarios y extraordinarios a nivel de lógica contable.
        - No se verifica si el monto pagado supera o cubre el préstamo.

    References:
        N/A
    */

    [ApiController]
    [Route("api/[controller]")]
    public class PagoController : ControllerBase
    {
        private readonly JsonDataService<Pago> _pagoService;
        private readonly JsonDataService<Prestamo> _prestamoService;
        private readonly JsonDataService<Tipo_Pago> _tipoPagoService;
        public PagoController()
        {
            _pagoService = new JsonDataService<Pago>("Data/pagos.json");
            _prestamoService = new JsonDataService<Prestamo>("Data/prestamos.json");
            _tipoPagoService = new JsonDataService<Tipo_Pago>("Data/tipo_pagos.json");
        }

        /* Function: Get
            Recupera todos los pagos registrados y los devuelve en formato JSON.

        Params:
            - N/A

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado 200 (OK) y los pagos en formato JSON.

        Restriction:
            Depende del servicio `JsonDataService<Pago>` para recuperar los datos desde el archivo JSON de pagos.

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
        */
        [HttpGet]
        public IActionResult Get()
        {
            var pagos = _pagoService.GetAll();
            return Ok(pagos);
        }

        /* Function: Post
            Crea un nuevo pago. Valida que el pago no sea nulo, que el préstamo y el tipo de pago asociados existan, y luego agrega el pago a la lista y lo guarda.

        Params:
            - pago: Objeto `Pago` que contiene los datos del pago a crear.

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado 201 (Created) si el pago se creó correctamente, o un código de error (BadRequest, NotFound) si se encuentra algún problema con los datos proporcionados.

        Restriction:
            Depende del servicio `JsonDataService<Pago>` para agregar el pago a la lista, `JsonDataService<Prestamo>` para validar la existencia del préstamo, y `JsonDataService<TipoPago>` para validar la existencia del tipo de pago.

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
        */
        [HttpPost]
        public IActionResult Post([FromBody] Pago pago)
        {
            if (pago == null)
            {
                return BadRequest("El pago no puede ser nulo");
            }
            // Validar existencia del prestamo
            var prestamos = _prestamoService.GetAll();
            var prestamoExistente = prestamos.Any(p => p.id_prestamo == pago.id_prestamo);
            if (!prestamoExistente)
            {
                return NotFound($"No existe un prestamo con el ID {pago.id_prestamo}");
            }

            // Validar el tipo de pago
            var tiposPagos = _tipoPagoService.GetAll();
            var tipoPagoExistente = tiposPagos.Any(tp => tp.tipo_pago == pago.id_tipo_pago);
            if (!tipoPagoExistente)
            {
                return NotFound($"No existe un tipo de pago con el ID {pago.tipo_pago}");
            }

            _pagoService.Add(pago);

            return CreatedAtAction(nameof(Post), pago);
        }

        /* Function: RealizarPago
            Permite realizar un pago asociado a un préstamo específico. Recibe los parámetros necesarios a través de la query string, como el ID del préstamo, el monto y el tipo de pago, y valida que el préstamo y el tipo de pago existan antes de registrar el pago.

        Params:
            - id_prestamo: ID del préstamo sobre el cual se realiza el pago.
            - monto: Monto del pago.
            - tipo: Tipo de pago (por ejemplo, "ABONO" o "PAGO EXTRAORDINARIO").

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado 201 (Created) si el pago se creó correctamente, o un código de error (NotFound) si se encuentra algún problema con los datos proporcionados.

        Restriction:
            Depende del servicio `JsonDataService<Pago>` para agregar el pago a la lista, `JsonDataService<Prestamo>` para validar la existencia del préstamo, y `JsonDataService<TipoPago>` para validar la existencia del tipo de pago.

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
        */
        [HttpPost("realizarPago")]
        public IActionResult RealizarPago([FromQuery] int id_prestamo, [FromQuery] double monto,
            [FromQuery] string tipo)
        {
            var prestamos = _prestamoService.GetAll();
            var prestamo = prestamos.FirstOrDefault(p => p.id_prestamo == id_prestamo);

            if (prestamo == null)
            {
                return NotFound($"No existe un préstamo con el ID {id_prestamo}");
            }

            // Validar tipo de pago
            var tiposPagos = _tipoPagoService.GetAll();
            var tipoPagoValido = tiposPagos.Any(tp => tp.tipo_pago == tipo);
            if (!tipoPagoValido)
            {
                return NotFound($"No existe un tipo de pago con ID '{tipo}'");
            }

            // Crear pago
            var nuevoPago = new Pago
            {
                id_prestamo = id_prestamo,
                monto = monto,
                fecha = DateOnly.FromDateTime(DateTime.Today),
                id_tipo_pago = tipo
            };

            // Guardar el pago
            _pagoService.Add(nuevoPago);

            return CreatedAtAction(nameof(RealizarPago), new { id_prestamo = id_prestamo, fecha = nuevoPago.fecha }, nuevoPago);
        }

    }
}
