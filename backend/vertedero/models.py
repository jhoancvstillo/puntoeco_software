from django.db import models

class Vertedero(models.Model):
    date = models.DateField()
    weight_kg = models.DecimalField(max_digits=10, decimal_places=2)
    value = models.DecimalField(max_digits=15, decimal_places=2)

    def __str__(self):
        return f"{self.date} - {self.weight_kg} kg - {self.value} CLP"
