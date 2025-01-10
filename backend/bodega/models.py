from django.db import models

# Categoría
class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.nombre


# Marca
class Marca(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.nombre


# # Modelo
# class Modelo(models.Model):
#     nombre = models.CharField(max_length=100)
#     descripcion = models.TextField(null=True, blank=True)
#     marca = models.ForeignKey(Marca, on_delete=models.CASCADE, related_name="modelos")

#     def __str__(self):
#         return f"{self.nombre} - {self.marca.nombre}"


# Productos
class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name="productos")
    marca = models.ForeignKey(Marca, on_delete=models.CASCADE, related_name="productos")
    # modelo = models.ForeignKey(Modelo, on_delete=models.CASCADE, related_name="productos", null=True, blank=True)
    precio_por_unidad = models.DecimalField(max_digits=10, decimal_places=2)


    def __str__(self):
        return f"{self.nombre} - {self.marca.nombre} ({self.categoria.nombre})"


# Stock
class Stock(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name="stocks")
    ubicacion = models.CharField(max_length=100, null=True, blank=True)  # Ejemplo: "Estante A, Bodega 1"
    cantidad = models.PositiveIntegerField()
    stock_minimo = models.PositiveIntegerField()

    def __str__(self):
        return f"Stock de {self.producto.nombre} en {self.ubicacion}: {self.cantidad}"
