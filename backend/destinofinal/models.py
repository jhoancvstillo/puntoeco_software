from django.db import models
from clients.models import Clients


# Modelo para los Certificados
class Certificado(models.Model):
    CATEGORIAS = [
        ('Metales', 'Metales'),
        ('Plásticos', 'Plásticos'),
        ('Fibras', 'Fibras'),
        ('Fitosanitarios', 'Fitosanitarios'),
    ]

    folio = models.CharField(max_length=20)
    categoria = models.CharField(max_length=20, choices=CATEGORIAS)
    numero_certificado = models.CharField(max_length=20, blank=True, null=True)
    client = models.ForeignKey(Clients, on_delete=models.CASCADE)
    fecha  = models.DateField()

    numero_guia = models.CharField(max_length=50, default='S/G')
    destino_final = models.CharField(max_length=255, blank=True, null=True)
    file = models.FileField(upload_to='certificadosDF/', blank=True, null=True)

    def __str__(self):
        return f"{self.categoria} - {self.folio}"


# Modelo específico para Plásticos
class PlasticoDetalle(models.Model):
    certificado = models.OneToOneField(Certificado, on_delete=models.CASCADE, related_name='plastico_detalle')
    clasificacion_resinas = models.CharField(max_length=255)
    cantidad_kg = models.FloatField(blank=True, null=True)
    
    def __str__(self):
        return f"Detalle Plásticos - {self.certificado.folio}"


# Modelo específico para Fitosanitarios
class FitosanitarioDetalle(models.Model):
    certificado = models.OneToOneField(Certificado, on_delete=models.CASCADE, related_name='fitosanitario_detalle')
    cantidad_01_l = models.IntegerField(blank=True, null=True)
    cantidad_025_l = models.IntegerField(blank=True, null=True)
    cantidad_05_l = models.IntegerField(blank=True, null=True)
    cantidad_1_l = models.IntegerField(blank=True, null=True)
    cantidad_2_l = models.IntegerField(blank=True, null=True)
    cantidad_3_l = models.IntegerField(blank=True, null=True)
    cantidad_4_l = models.IntegerField(blank=True, null=True)
    cantidad_5_l = models.IntegerField(blank=True, null=True)
    cantidad_10_l = models.IntegerField(blank=True, null=True)
    cantidad_15_l = models.IntegerField(blank=True, null=True)
    cantidad_20_l = models.IntegerField(blank=True, null=True)
    cantidad_25_l = models.IntegerField(blank=True, null=True)
    cantidad_30_l = models.IntegerField(blank=True, null=True)
    cantidad_60_l = models.IntegerField(blank=True, null=True)
    cantidad_100_l = models.IntegerField(blank=True, null=True)
    cantidad_200_l = models.IntegerField(blank=True, null=True)
    cantidad_tapas_l = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f"Detalle Fitosanitarios - {self.certificado.folio}"


# Modelo genérico para Materiales (Metales y Fibras)
class MaterialDetalle(models.Model):
    certificado = models.OneToOneField(Certificado, on_delete=models.CASCADE, related_name='material_detalle')
    material = models.CharField(max_length=255)
    cantidad_kg = models.FloatField()

    def __str__(self):
        return f"Detalle Material - {self.certificado.folio}"
