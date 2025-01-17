from django.db import models
from decimal import Decimal
from trabajadores.models import Trabajador


class Combustible(models.Model):
    id = models.AutoField(primary_key=True)
    fecha = models.DateField()  # Stores only the date
    hora = models.TimeField()  # Stores only the time
    patente = models.CharField(max_length=50)  # Vehicle identifier (e.g., plate number)
    conductor = models.ForeignKey(Trabajador, on_delete=models.CASCADE)  # Driver's reference from Conductor model
    # Fuel details  
    litros = models.DecimalField(max_digits=10, decimal_places=5)  # Liters of fuel
    valor_litro = models.DecimalField(max_digits=10, decimal_places=5)  # Cost per liter
    total = models.DecimalField(max_digits=15, decimal_places=2, editable=False)  # Total cost (calculated automatically)

    # Payment and documentation details
    tarjeta = models.CharField(max_length=50, null=True, blank=True)  # Card used for payment
    guia = models.CharField(max_length=50, null=True, blank=True)  # Guide or receipt number

    # Additional notes
    observaciones = models.TextField(null=True, blank=True)  # Optional notes or remarks

    def save(self, *args, **kwargs):
        # Automatically calculate the total before 
        self.total = self.litros * self.valor_litro + Decimal("0.19") * self.litros
        super().save(*args, **kwargs)

    def __str__(self):
        # String representation for admin or debugging purposes
        return f"{self.fecha} - {self.vehiculo} - {self.conductor}"
