from django.db import models
from django.conf import settings

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


# Productos
class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, blank=True, related_name="productos")
    marca = models.ForeignKey(Marca, on_delete=models.SET_NULL, null=True, blank=True, related_name="productos")
    precio_por_unidad = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.nombre} - {self.marca.nombre if self.marca else 'Sin Marca'} ({self.categoria.nombre if self.categoria else 'Sin Categoría'})"


# Stock
class Stock(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name="stocks")
    ubicacion = models.CharField(max_length=100, null=True, blank=True)  # Ejemplo: "Estante A, Bodega 1"
    cantidad = models.PositiveIntegerField()
    stock_minimo = models.PositiveIntegerField()

    def __str__(self):
        return f"Stock de {self.producto.nombre} en {self.ubicacion}: {self.cantidad}"


# StockMovement
class StockMovement(models.Model):
    class MovementType(models.TextChoices):
        ADD = 'add', 'Agregar'
        REMOVE = 'remove', 'Retirar'

    producto = models.ForeignKey(Producto, on_delete=models.SET_NULL, null=True, blank=True, related_name="movimientos")
    stock_afectado = models.ForeignKey(Stock, on_delete=models.SET_NULL, null=True, blank=True, related_name="movimientos")
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='movimientos')
    movement_type = models.CharField(max_length=6, choices=MovementType.choices)
    quantity = models.PositiveIntegerField()
    observation = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        producto_nombre = self.producto.nombre if self.producto else "Producto Eliminado"
        return f"{self.movement_type.upper()} {self.quantity} de {producto_nombre} por {self.user} el {self.created_at}"
