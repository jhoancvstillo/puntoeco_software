# models.py

from django.db import models
from django.conf import settings
from trabajadores.models import Trabajador
from clients.models import Clients

class Cotizacion(models.Model):
    client = models.ForeignKey(Clients, on_delete=models.CASCADE)
    requested_by = models.CharField(max_length=255)
    worker = models.ForeignKey(Trabajador, on_delete=models.CASCADE)
    date_time = models.DateTimeField()
    pdf_cotizacion = models.FileField(upload_to="cotizaciones_pdfs/", null=True, blank=True)

    def __str__(self):
        return f"Cotización #{self.id} - {self.client.name}"

    def total_value(self):
        """
        Calcula el valor total de la cotización sumando los valores de los detalles asociados.
        """
        return sum(detail.value for detail in self.detalles.all())


class DetalleCotizacion(models.Model):
    cotizacion = models.ForeignKey(Cotizacion, on_delete=models.CASCADE, related_name="detalles")
    description = models.CharField(max_length=255)
    value = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.description} - {self.value}"
