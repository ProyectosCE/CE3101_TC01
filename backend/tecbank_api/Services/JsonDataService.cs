using System.Text.Json;

namespace tecbank_api.Services
{
    /* Class: JsonDataService<T>
        Servicio para manejar operaciones de lectura y escritura sobre archivos JSON. Permite obtener, guardar y añadir elementos genéricos de tipo T en un archivo JSON.

    Attributes:
        - _filePath: string - Ruta del archivo JSON donde se almacenan los datos.

    Constructor:
        - JsonDataService: Constructor que inicializa el servicio con la ruta del archivo JSON.
        Parámetros:
        - filePath: string - Ruta del archivo JSON.

    Methods:
        - GetAll: Recupera todos los elementos del archivo JSON y los deserializa en una lista de tipo T.
        - SaveAll: Guarda una lista de elementos de tipo T en el archivo JSON.
        - Add: Añade un nuevo elemento de tipo T al archivo JSON.

    Problems:
        Ningún problema conocido durante la implementación de esta clase.

    References:
        N/A
    */
    public class JsonDataService<T>
    {
        private readonly string _filePath;

        public JsonDataService(string filePath)
        {
            _filePath = filePath;
            if (!File.Exists(_filePath))
            {
                File.WriteAllText(_filePath, "[]");
            }
        }

        /* Function: GetAll
            Recupera todos los elementos del archivo JSON y los deserializa en una lista de tipo T.

        Params:
            - N/A

        Returns:
            - List<T>: Lista de elementos de tipo T deserializados desde el archivo JSON. Si el archivo está vacío o no contiene datos válidos, retorna una lista vacía.

        Restriction:
            Depende de la existencia y validez del archivo JSON en la ruta especificada.

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
        */
        public List<T> GetAll()
        {
            var json = File.ReadAllText(_filePath);
            return JsonSerializer.Deserialize<List<T>>(json) ?? new List<T>();
        }

        /* Function: SaveAll
            Guarda una lista de elementos de tipo T en el archivo JSON, sobrescribiendo el contenido existente.

        Params:
            - items: List<T> - Lista de elementos de tipo T a guardar en el archivo JSON.

        Returns:
            - void: No retorna ningún valor.

        Restriction:
            Sobrescribe el archivo JSON con la lista proporcionada. Si el archivo es grande, puede haber implicaciones en el rendimiento.
        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
        */
        public void SaveAll(List<T> items)
        {
            var json = JsonSerializer.Serialize(items, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_filePath, json);
        }

        /* Function: Add
            Añade un nuevo elemento de tipo T al archivo JSON.

        Params:
            - item: T - El nuevo elemento de tipo T a añadir.

        Returns:
            - void: No retorna ningún valor.

        Restriction:
            Depende de la existencia del archivo JSON. Si el archivo no existe, se crea automáticamente.

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
        */
        public void Add(T item)
        {
            var items = GetAll();
            items.Add(item);
            SaveAll(items);
        }
    }
}
