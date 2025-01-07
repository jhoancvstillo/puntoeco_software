from django.db import models

class Clients(models.Model):
    name = models.CharField(max_length=100)  # Nombre del cliente
    mail = models.EmailField(unique=True)  # Correo único
    phoneNumber = models.CharField(max_length=15)  # Teléfono
    address = models.TextField()  # Dirección física del cliente
    # RUT del cliente con valor por defecto para registros existentes
    rut = models.CharField(
        max_length=12,
        unique=True,
        default='99999999-9',  # Usa aquí el default que desees
        help_text="Formato esperado: 12345678-9"
    )

    def __str__(self):
        return f"{self.name} ({self.rut})"


class Conductor(models.Model):
    nombre = models.CharField(max_length=100)  # Nombre del conductor
    rut = models.CharField(max_length=12, unique=True)  # RUT único del conductor
    cliente = models.ForeignKey(
        Clients, 
        on_delete=models.CASCADE, 
        related_name='conductores'
    )  # Relación con el cliente (empresa)

    def __str__(self):
        return f"{self.nombre} ({self.rut}) - {self.cliente.name}"
