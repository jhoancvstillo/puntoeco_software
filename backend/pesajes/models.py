from django.db import models
from clients.models import Clients, Conductor  # Importamos los modelos necesarios de clients

class Certificado(models.Model):
    dispatch_guide = models.CharField(max_length=20, null=True, blank=True)  # Guía de despacho
    transaction = models.CharField(max_length=50, null=True, blank=True)    # Tipo de transacción
    transaction_other = models.CharField(max_length=50, null=True, blank=True)  # Otra transacción opcional
    tipo_camion = models.CharField(max_length=50)
    cliente = models.ForeignKey(
        Clients,
        on_delete=models.CASCADE,
        related_name="certificados"
    )
    codigo_producto = models.CharField(max_length=50)
    # Reemplazamos la FK a Vehiculo por un simple CharField (patente):
    patente = models.CharField(max_length=10, blank=True, null=True)
    conductor = models.ForeignKey(
        Conductor,
        on_delete=models.CASCADE,
        related_name="certificados"
    )
    fecha = models.DateField()
    hora_ingreso = models.TimeField()
    hora_salida = models.TimeField()
    peso_1 = models.DecimalField(max_digits=10, decimal_places=2)
    peso_2 = models.DecimalField(max_digits=10, decimal_places=2)
    pdf_ticket = models.FileField(upload_to="tickets/", null=True, blank=True)


    def __str__(self):
        return f"Certificado {self.codigo_producto} - {self.cliente.name}"
