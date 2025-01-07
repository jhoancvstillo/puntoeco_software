from django.db import models

# Create your models here.
class Trabajador(models.Model):
    photo = models.ImageField(upload_to='trabajadores/photos/', blank=True, null=True)
    name = models.CharField(max_length=100)
    position = models.CharField(max_length=50)
    join_date = models.DateField()
    status = models.CharField(max_length=20, choices=[('active', 'Active'), ('inactive', 'Inactive')], default='active')
    rut = models.CharField(max_length=20)
    phone = models.CharField(max_length=20, blank=True, null=True)
    is_driver = models.BooleanField(default=False)

    def __str__(self):
        return self.name
    
class Asistencia(models.Model):
    worker = models.ForeignKey(Trabajador, on_delete=models.CASCADE)
    date = models.DateField()
    check_in = models.TimeField()
    check_out = models.TimeField()
    status = models.CharField(max_length=20, choices=[('present', 'Present'), ('late','late'), ('absent', 'Absent')], default='present')

    def __str__(self):
        return f'Asistencia de {self.worker} - {self.date}'
    
    # Pagos y beneficios
class PagoBeneficio(models.Model):
    worker = models.ForeignKey(Trabajador, on_delete=models.CASCADE)
    date = models.DateField()
    base_salary = models.DecimalField(max_digits=10, decimal_places=2)
    bonuses = models.DecimalField(max_digits=10, decimal_places=2)
    deductions = models.DecimalField(max_digits=10, decimal_places=2)
    total_paid = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Pago a {self.worker.name} - {self.date}"


class Nota(models.Model):
    worker = models.ForeignKey(Trabajador, on_delete=models.CASCADE)
    date = models.DateField()
    rating = models.IntegerField()
    observation = models.TextField()

    def __str__(self):
        return f'Nota de {self.worker} - {self.date}'

class Documento(models.Model):
    worker = models.ForeignKey(Trabajador, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=50) # DNI, Pasaporte, Carnet de Extranjería, etc.
    upload_date = models.DateField()
    file_url = models.FileField(upload_to='trabajadores/documentos/')

class VacacionPermiso(models.Model):
    worker = models.ForeignKey(Trabajador, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    type = models.CharField(max_length=50, choices=[('vacation', 'Vacation'), ('permission', 'Permission')], default='vacation')
    status = models.CharField(max_length=20, choices=[('approved', 'Approved'), ('rejected', 'rejected'), ('pending', 'Pending')], default='pending')

    def __str__(self):
        return f'{self.worker} - {self.start_date} - {self.end_date}'
    

class Capacitacion(models.Model):
    worker = models.ForeignKey(Trabajador, on_delete=models.CASCADE)
    course_name = models.CharField(max_length=100)
    date = models.DateField()
    status = models.CharField(max_length=20, choices=[("Completed", "Completed"), ("In Progress", "In Progress")])

    def __str__(self):
        return f"Capacitación {self.course_name} de {self.worker.name}"


# Gestión de incidentes
class Incidente(models.Model):
    worker = models.ForeignKey(Trabajador, on_delete=models.CASCADE)
    date = models.DateField()
    description = models.TextField()
    severity = models.CharField(max_length=20, choices=[("Low", "Low"), ("Medium", "Medium"), ("High", "High")])
    corrective_action = models.TextField()

    def __str__(self):
        return f"Incidente de {self.worker.name} - {self.date}"
