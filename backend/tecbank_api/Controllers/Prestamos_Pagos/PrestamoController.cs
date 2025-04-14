using Microsoft.AspNetCore.Mvc;
using tecbank_api.Models.Asesores;
using tecbank_api.Models.Prestamos_Pagos;
using tecbank_api.Services;
using tecbank_api.Models.Clientes_Cuentas;

namespace tecbank_api.Controllers.Prestamos_Pagos
{
    /* Class: PrestamoController
    Controlador de API que gestiona las operaciones relacionadas con los préstamos, incluyendo su simulación, solicitud, registro y asignación de asesores.

    Attributes:
        - _prestamoService: JsonDataService<Prestamo> - Servicio para manejar los datos de préstamos.
        - _asesorService: JsonDataService<Asesor> - Servicio para manejar los datos de asesores.
        - _clienteService: JsonDataService<Cliente> - Servicio para manejar los datos de clientes.

    Constructor:
        - PrestamoController: Constructor predeterminado que inicializa los servicios para manejar préstamos, asesores y clientes mediante archivos JSON.

    Methods:
        - Get: Método que maneja solicitudes GET para obtener todos los préstamos registrados.
          Tipo: IActionResult  
          Descripción: Retorna la lista completa de préstamos almacenados.

        - Post: Método que maneja solicitudes POST para registrar un nuevo préstamo.
          Tipo: IActionResult  
          Parámetro: [FromBody] Prestamo prestamo - Objeto préstamo enviado en el cuerpo de la solicitud.
          Descripción:
            Valida que el cliente y el asesor existan. Asigna automáticamente un `id_prestamo` incremental antes de guardar.

        - consultarPrestamos: Obtiene todos los préstamos asociados a un cliente específico.
          Tipo: IActionResult  
          Parámetro: int id_cliente - ID del cliente a consultar.
          Descripción: Filtra los préstamos por cliente y retorna los resultados.

        - solicitarPrestamo: Simula un préstamo con una tasa fija del 10% anual, sin almacenarlo.
          Tipo: IActionResult  
          Parámetros: double monto, int plazoMeses  
          Descripción: Calcula la cuota mensual y el total a pagar. Ideal para mostrar una simulación previa a la solicitud.

        - realizarPrestamo: Registra un nuevo préstamo para un cliente específico sin asignar aún un asesor.
          Tipo: IActionResult  
          Parámetros: int id_cliente, double monto, int plazoMeses  
          Descripción:
            Valida al cliente, calcula la cuota mensual y guarda el préstamo con fecha de inicio/final basada en el plazo.

        - aprobarPrestamo: Asigna un asesor a un préstamo ya registrado.
          Tipo: IActionResult  
          Parámetros: int id_prestamo, int id_asesor  
          Descripción:
            Verifica que el préstamo y el asesor existan, luego asigna el asesor al préstamo y guarda los cambios.

        - calcularCuotaMensual (NonAction): Método auxiliar que calcula la cuota mensual de un préstamo usando la fórmula de anualidad.
          Tipo: double  
          Parámetros: double monto, int plazoMeses, double tasaInteresAnual  
          Descripción: Devuelve la cuota mensual redondeada a dos decimales.

    Example:
        // Simulación de préstamo
        POST /api/prestamo/solicitarPrestamo?monto=10000&plazoMeses=12

        // Realizar un préstamo
        POST /api/prestamo/realizarPrestamo?id_cliente=1&monto=5000&plazoMeses=6

        // Asignar asesor
        POST /api/prestamo/aprobarPrestamo?id_prestamo=1&id_asesor=2

    Problems:
        - Actualmente no se valida si el cliente ya tiene préstamos activos o en mora.
        - No se genera aún un calendario de pagos ni se maneja el estado del préstamo (activo, aprobado, finalizado, etc.).

    References:
        N/A
    */

    [ApiController]
    [Route("api/[controller]")]
    public class PrestamoController : ControllerBase
    {
        private readonly JsonDataService<Prestamo> _prestamoService;
        private readonly JsonDataService<Asesor> _asesorService;
        private readonly JsonDataService<Cliente> _clienteService;

        public PrestamoController()
        {
            _prestamoService = new JsonDataService<Prestamo>("Data/prestamos.json");
            _asesorService = new JsonDataService<Asesor>("Data/asesores.json");
            _clienteService = new JsonDataService<Cliente>("Data/clientes.json");
        }

        /* Function: Get
            Recupera todos los préstamos registrados y los devuelve en formato JSON.

        Params:
            - N/A

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado 200 (OK) y los préstamos en formato JSON.

        Restriction:
            Depende del servicio `JsonDataService<Prestamo>` para recuperar los datos desde el archivo JSON de préstamos.

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
        */
        [HttpGet]
        public IActionResult Get()
        {
            var prestamos = _prestamoService.GetAll();
            return Ok(prestamos);
        }

        /* Function: Post
            Crea un nuevo préstamo. Valida que el préstamo no sea nulo, que el asesor y el cliente asociados existan, y luego agrega el préstamo a la lista y lo guarda.

        Params:
            - prestamo: Objeto `Prestamo` que contiene los datos del préstamo a crear.

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado 201 (Created) si el préstamo se creó correctamente, o un código de error (BadRequest, NotFound) si se encuentra algún problema con los datos proporcionados.

        Restriction:
            Depende del servicio `JsonDataService<Prestamo>` para agregar el préstamo a la lista, `JsonDataService<Asesor>` para validar la existencia del asesor, y `JsonDataService<Cliente>` para validar la existencia del cliente.

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
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
            var clienteExistente = clientes.Any(c => c.id_cliente == prestamo.id_cliente);
            if (!clienteExistente)
            {
                return NotFound($"No existe un cliente con el ID {prestamo.id_cliente}");
            }

            // Asignar datos adicionales
            var prestamos = _prestamoService.GetAll();
            prestamo.id_prestamo = prestamos.Any() ? prestamos.Max(p => p.id_prestamo) + 1 : 1; // Incrementar el id_prestamo previo

            _prestamoService.Add(prestamo);
            return CreatedAtAction(nameof(Post), new { id = prestamo.id_prestamo }, prestamo);
        }

        /* Function: consultarPrestamos
            Consulta los préstamos asociados a un cliente específico.

        Params:
            - id_cliente: ID del cliente cuyos préstamos se desean consultar.

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado 200 (OK) y los préstamos asociados al cliente, o un código de error si no existen préstamos para el cliente.

        Restriction:
            Depende del servicio `JsonDataService<Prestamo>` para obtener los préstamos del cliente.

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
        */
        [HttpGet("consultarPrestamos/{id_cliente}")]
        public IActionResult consultarPrestamos(int id_cliente)
        {
            var prestamos = _prestamoService.GetAll()
                .Where(p => p.id_cliente == id_cliente)
                .ToList();

            return Ok(prestamos);
        }

        /* Function: solicitarPrestamo
            Permite simular un préstamo y calcular la cuota mensual.

        Params:
            - monto: Monto del préstamo solicitado.
            - plazoMeses: Plazo en meses del préstamo solicitado.

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado 200 (OK) y los detalles del préstamo simulado (monto, plazo, tasa de interés, cuota mensual y total a pagar).

        Restriction:
            N/A

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
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
            Crea un nuevo préstamo para un cliente específico. Valida la existencia del cliente y calcula la cuota mensual antes de registrar el préstamo.

        Params:
            - id_cliente: ID del cliente que solicita el préstamo.
            - monto: Monto del préstamo solicitado.
            - plazoMeses: Plazo en meses del préstamo solicitado.

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado 201 (Created) si el préstamo se creó correctamente, o un código de error (NotFound) si no se encuentra el cliente.

        Restriction:
            Depende del servicio `JsonDataService<Prestamo>` para agregar el préstamo a la lista y del servicio `JsonDataService<Cliente>` para validar la existencia del cliente.

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
        */
        [HttpPost("realizarPrestamo")]
        public IActionResult realizarPrestamo([FromQuery] int id_cliente, [FromQuery] double monto, [FromQuery] int plazoMeses)
        {
            var clientes = _clienteService.GetAll();
            if (!clientes.Any(c => c.id_cliente == id_cliente))
                return NotFound("Cliente no encontrado");

            double tasaInteresAnual = 0.10;
            double cuota = calcularCuotaMensual(monto, plazoMeses, tasaInteresAnual);

            var nuevoPrestamo = new Prestamo
            {
                id_prestamo = _prestamoService.GetAll().Any() ? _prestamoService.GetAll().Max(p => p.id_prestamo) + 1 : 1,
                id_cliente = id_cliente,
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
            Permite aprobar un préstamo y asignarle un asesor.

        Params:
            - id_prestamo: ID del préstamo que se desea aprobar.
            - id_asesor: ID del asesor que aprobará el préstamo.

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado 200 (OK) si el préstamo fue aprobado correctamente, o un código de error (NotFound) si el préstamo o asesor no existen.

        Restriction:
            Depende del servicio `JsonDataService<Prestamo>` para obtener y guardar los préstamos, y del servicio `JsonDataService<Asesor>` para validar la existencia del asesor.

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
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
            Calcula la cuota mensual de un préstamo usando la fórmula de amortización estándar.

        Params:
            - monto: Monto total del préstamo.
            - plazoMeses: Número de meses para pagar el préstamo.
            - tasaInteresAnual: Tasa de interés anual aplicada al préstamo.

        Returns:
            - double: El valor de la cuota mensual redondeada a dos decimales.

        Restriction:
            N/A

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
        */
        [NonAction]
        public double calcularCuotaMensual(double monto, int plazoMeses, double tasaInteresAnual)
        {
            double tasaMensual = tasaInteresAnual / 12;
            return Math.Round((monto * tasaMensual) / (1 - Math.Pow(1 + tasaMensual, -plazoMeses)), 2);
        }
    }
}
