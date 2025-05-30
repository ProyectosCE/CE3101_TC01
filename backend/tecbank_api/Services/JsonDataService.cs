﻿using System.ComponentModel.DataAnnotations;
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
        - Remove: Elimina un elemento de tipo T del archivo JSON.
        - Update: Actualiza un elemento de tipo T en el archivo JSON.
        - Delete: Elimina un elemento de tipo T del archivo JSON por referencia.

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

        /* Function: Remove
            Elimina un elemento de tipo T del archivo JSON.

        Params:
            - item: T - El elemento de tipo T a eliminar.

        Returns:
            - void: No retorna ningún valor.

        Restriction:
            Depende de la existencia del archivo JSON. Si el archivo no existe, se crea automáticamente.

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
        */
        public void Remove(T item)
        {
            var items = GetAll();
            items.Remove(item);
            SaveAll(items);
        }

        /* Function: Update
            Actualiza un elemento de tipo T en el archivo JSON.

        Params:
            - item: T - El elemento de tipo T a actualizar.

        Returns:
            - void: No retorna ningún valor.

        Restriction:
            Depende de la existencia del archivo JSON. Si el archivo no existe, se crea automáticamente.

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
        */
        public void Update(T item)
        {
            var items = GetAll();

            // Buscar la propiedad marcada con [Key]
            var keyProperty = typeof(T).GetProperties()
                .FirstOrDefault(prop => Attribute.IsDefined(prop, typeof(KeyAttribute)));

            if (keyProperty == null)
                throw new InvalidOperationException($"La clase {typeof(T).Name} no tiene una propiedad marcada con [Key].");

            var itemKey = keyProperty.GetValue(item);

            for (int i = 0; i < items.Count; i++)
            {
                var existingKey = keyProperty.GetValue(items[i]);
                if (Equals(existingKey, itemKey))
                {
                    items[i] = item;
                    SaveAll(items);
                    return;
                }
            }

            throw new InvalidOperationException("No se encontró el elemento a actualizar.");
        }

        /* Function: Delete
            Elimina un elemento de tipo T del archivo JSON por referencia.

        Params:
            - item: T - El elemento de tipo T a eliminar.

        Returns:
            - void: No retorna ningún valor.

        Restriction:
            Depende de la existencia del archivo JSON. Si el archivo no existe, se crea automáticamente.

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
        */
        public void Delete(T item)
        {
            var items = GetAll();

            // Verificar si el tipo T tiene propiedades
            var properties = typeof(T).GetProperties();
            if (properties.Length == 0)
            {
                throw new InvalidOperationException($"El tipo {typeof(T).Name} no tiene propiedades definidas.");
            }

            // Buscar la propiedad marcada con [Key]
            var keyProperty = properties.FirstOrDefault(prop => Attribute.IsDefined(prop, typeof(KeyAttribute)));

            if (keyProperty == null)
            {
                throw new InvalidOperationException($"La clase {typeof(T).Name} no tiene una propiedad marcada con [Key].");
            }

            var itemKey = keyProperty.GetValue(item);

            // Buscar y eliminar el elemento con la misma clave
            var itemToRemove = items.FirstOrDefault(existingItem =>
                Equals(keyProperty.GetValue(existingItem), itemKey));

            if (itemToRemove != null)
            {
                items.Remove(itemToRemove);
                SaveAll(items);
            }
        }
    }
}
