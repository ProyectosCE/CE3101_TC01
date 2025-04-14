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

using Microsoft.AspNetCore.Mvc;
using tecbank_api.Models.Asesores;
using tecbank_api.Models.Prestamos_Pagos;
using tecbank_api.Services;
using tecbank_api.Models.Clientes_Cuentas;

/* Class: PrestamoController
Controlador API para la gestión de préstamos en el sistema TecBank.
Permite consultar, crear, simular, aprobar y asignar préstamos a clientes y asesores.

Attributes:
- _prestamoService: JsonDataService<Prestamo> - Servicio para acceder y manipular los datos de préstamos.
- _asesorService: JsonDataService<Asesor> - Servicio para validar y consultar asesores.
- _clienteService: JsonDataService<Cliente> - Servicio para validar y consultar clientes.

Constructor:
- PrestamoController: Inicializa los servicios de préstamos, asesores y clientes.

Methods:
- Get: Obtiene la lista de todos los préstamos.
- Post: Crea un nuevo préstamo validando la existencia de asesor y cliente.
- consultarPrestamos: Consulta préstamos asociados a una cédula.
- solicitarPrestamo: Simula un préstamo y calcula la cuota mensual.
- realizarPrestamo: Registra un préstamo real para un cliente.
- aprobarPrestamo: Asigna un asesor a un préstamo existente.
- calcularCuotaMensual: Calcula la cuota mensual de un préstamo (NonAction).

Example:
    var controller = new PrestamoController();
    var prestamos = controller.Get();
    controller.Post(new Prestamo { ... });
*/
namespace tecbank_api.Controllers.Prestamos_Pagos
{
    [ApiController]
    [Route("api/[controller]")]
    public class PrestamoController : ControllerBase
    {
        // Servicios para préstamos, asesores y clientes
        private readonly JsonDataService<Prestamo> _prestamoService;
        private readonly JsonDataService<Asesor> _asesorService;
        private readonly JsonDataService<Cliente> _clienteService;

        // Constructor: Inicializa los servicios con los archivos JSON.
        public PrestamoController()
        {
            _prestamoService = new JsonDataService<Prestamo>("Data/prestamos.json");
            _asesorService = new JsonDataService<Asesor>("Data/asesores.json");
            _clienteService = new JsonDataService<Cliente>("Data/clientes.json");
        }

        /* Function: Get
        Obtiene la lista de todos los préstamos registrados.

        Params:
        - Ninguno.

        Returns:
        - IActionResult: HTTP 200 (OK) con la lista de préstamos.

        Restriction:
        Solo acepta solicitudes HTTP GET.
        */
        [HttpGet]
        public IActionResult Get()
        {
            var prestamos = _prestamoService.GetAll();
            return Ok(prestamos);
        }

        /* Function: Post
        Crea un nuevo préstamo, validando la existencia del asesor y del cliente.

        Params:
        - prestamo: Prestamo - Objeto préstamo recibido en el cuerpo de la solicitud.

        Returns:
        - IActionResult: HTTP 201 (Created) si se crea, 400/404 si hay error.

        Restriction:
        El asesor y el cliente deben existir.
        */
        [HttpPost]
        public IActionResult Post([FromBody] Prestamo prestamo)
        {
            if (prestamo == null)
            {
                return BadRequest("El prestamo no puede ser nulo");
            }
            // Validar existencia del asesor
            var asesores = _asesorService.GetAll();
            var asesorExistente = asesores.Any(a => a.id_asesor == prestamo.id_asesor);
            if (!asesorExistente)
            {
                return NotFound($"No existe un asesor con el ID {prestamo.id_asesor}");
            }
            // Validar existencia del cliente
            var clientes = _clienteService.GetAll();
            var clienteExistente = clientes.Any(c => c.cedula == prestamo.cedula);
            if (!clienteExistente)
            {
                return NotFound($"No existe un cliente con la cédula {prestamo.cedula}");
            }

            // Asignar datos adicionales
            var prestamos = _prestamoService.GetAll();
            prestamo.id_prestamo = prestamos.Any() ? prestamos.Max(p => p.id_prestamo) + 1 : 1;

            _prestamoService.Add(prestamo);
            return CreatedAtAction(nameof(Post), new { id = prestamo.id_prestamo }, prestamo);
        }

        /* Function: consultarPrestamos
        Consulta todos los préstamos asociados a una cédula de cliente.

        Params:
        - cedula: string - Cédula del cliente.

        Returns:
        - IActionResult: HTTP 200 (OK) con la lista de préstamos.

        Restriction:
        Ninguna restricción especial.
        */
        [HttpGet("consultarPrestamos/{cedula}")]
        public IActionResult consultarPrestamos(string cedula)
        {
            var prestamos = _prestamoService.GetAll()
                .Where(p => p.cedula == cedula)
                .ToList();

            return Ok(prestamos);
        }

        /* Function: solicitarPrestamo
        Simula un préstamo y calcula la cuota mensual y el total a pagar.

        Params:
        - monto: double - Monto solicitado.
        - plazoMeses: int - Plazo en meses.

        Returns:
        - IActionResult: HTTP 200 (OK) con los datos simulados.

        Restriction:
        Ninguna restricción especial.
        */
        [HttpPost("solicitarPrestamo")]
        public IActionResult solicitarPrestamo([FromQuery] double monto, [FromQuery] int plazoMeses)
        {
            double tasaInteresAnual = 0.10;
            double cuota = calcularCuotaMensual(monto, plazoMeses, tasaInteresAnual);
            var prestamoSimulado = new
            {
                monto_original = monto,
                plazo = plazoMeses,
                tasa_interes = tasaInteresAnual,
                cuota_mensual = cuota,
                total_a_pagar = cuota * plazoMeses
            };

            return Ok(prestamoSimulado);
        }

        /* Function: realizarPrestamo
        Registra un préstamo real para un cliente existente.

        Params:
        - cedula: string - Cédula del cliente.
        - monto: double - Monto solicitado.
        - plazoMeses: int - Plazo en meses.

        Returns:
        - IActionResult: HTTP 201 (Created) si se registra, 404 si el cliente no existe.

        Restriction:
        El cliente debe existir.
        */
        [HttpPost("realizarPrestamo")]
        public IActionResult realizarPrestamo([FromQuery] string cedula, [FromQuery] double monto, [FromQuery] int plazoMeses)
        {
            var clientes = _clienteService.GetAll();
            if (!clientes.Any(c => c.cedula == cedula))
                return NotFound("Cliente no encontrado");

            double tasaInteresAnual = 0.10;
            double cuota = calcularCuotaMensual(monto, plazoMeses, tasaInteresAnual);

            var nuevoPrestamo = new Prestamo
            {
                id_prestamo = _prestamoService.GetAll().Any() ? _prestamoService.GetAll().Max(p => p.id_prestamo) + 1 : 1,
                cedula = cedula,
                monto_original = monto,
                saldo = monto,
                tasa_interes = tasaInteresAnual,
                fecha_inicio = DateOnly.FromDateTime(DateTime.Today),
                fecha_final = DateOnly.FromDateTime(DateTime.Today.AddMonths(plazoMeses)),
                id_asesor = 0 // aún no asignado
            };

            _prestamoService.Add(nuevoPrestamo);
            return CreatedAtAction(nameof(realizarPrestamo), new { id = nuevoPrestamo.id_prestamo }, nuevoPrestamo);
        }

        /* Function: aprobarPrestamo
        Asigna un asesor a un préstamo existente.

        Params:
        - id_prestamo: int - ID del préstamo.
        - id_asesor: int - ID del asesor.

        Returns:
        - IActionResult: HTTP 200 (OK) si se asigna, 404 si no existe préstamo o asesor.

        Restriction:
        El préstamo y el asesor deben existir.
        */
        [HttpPost("aprobarPrestamo")]
        public IActionResult aprobarPrestamo([FromQuery] int id_prestamo, [FromQuery] int id_asesor)
        {
            var prestamos = _prestamoService.GetAll();
            var prestamo = prestamos.FirstOrDefault(p => p.id_prestamo == id_prestamo);
            if (prestamo == null)
                return NotFound("Préstamo no encontrado");

            var asesores = _asesorService.GetAll();
            if (!asesores.Any(a => a.id_asesor == id_asesor))
                return NotFound("Asesor no encontrado");

            prestamo.id_asesor = id_asesor;

            _prestamoService.SaveAll(prestamos);
            return Ok(true);
        }

        /* Function: calcularCuotaMensual
        Calcula la cuota mensual de un préstamo usando la fórmula de amortización.

        Params:
        - monto: double - Monto del préstamo.
        - plazoMeses: int - Plazo en meses.
        - tasaInteresAnual: double - Tasa de interés anual.

        Returns:
        - double: Cuota mensual calculada.

        Restriction:
        Método auxiliar, no expuesto como endpoint.
        */
        [NonAction]
        public double calcularCuotaMensual(double monto, int plazoMeses, double tasaInteresAnual)
        {
            double tasaMensual = tasaInteresAnual / 12;
            return Math.Round((monto * tasaMensual) / (1 - Math.Pow(1 + tasaMensual, -plazoMeses)), 2);
        }
    }
}
