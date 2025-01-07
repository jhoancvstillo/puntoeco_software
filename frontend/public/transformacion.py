import json
import os

# Ruta del archivo JSON de entrada y salida
input_file = "info.json"
output_file = "output.json"

# Verifica si el archivo existe
if not os.path.exists(input_file):
    print(f"El archivo {input_file} no existe en el directorio actual.")
    exit()

# Cargar el archivo JSON de entrada
with open(input_file, "r") as file:
    data = json.load(file)

# Función para transformar cada registro
def transform_entry(entry):
    return {
        "fecha": entry.get("date", ""),
        "hora": f"{entry.get('time', '')}:00",  # Asegurar formato de hora con segundos
        "patente": entry.get("license_plate", ""),
        "conductor": 4,
        "litros": entry.get("liters", 0),
        "valor_litro": entry.get("price_per_liter", 0),
        "tarjeta": entry.get("card", ""),
        "guia": entry.get("guide", ""),
        "observaciones": entry.get("observations", ""),
    }

# Transformar todos los registros
transformed_data = [transform_entry(entry) for entry in data]

# Guardar el resultado en un nuevo archivo JSON
with open(output_file, "w") as file:
    json.dump(transformed_data, file, indent=4)

print(f"Transformación completada. Resultado guardado en '{output_file}'")
