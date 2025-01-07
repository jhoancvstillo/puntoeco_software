from django.db import models

# -----------------------------------------------
# MODELO PRINCIPAL: Worker
# -----------------------------------------------
class Worker(models.Model):
    STATUS_CHOICES = [
        ('Active', 'Activo'),
        ('Inactive', 'Inactivo')
    ]

    name = models.CharField(max_length=200)
    position = models.CharField(max_length=200)
    date_of_joining = models.DateField()
    status = models.CharField(max_length=8, choices=STATUS_CHOICES, default='Active')
    photo = models.URLField(blank=True, null=True)  # o puedes usar ImageField si lo manejas con un storage

    # Ejemplo de contacto y datos personales
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)

    national_id = models.CharField(max_length=50, blank=True, null=True)  # Rut o cédula
    date_of_birth = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} - {self.position}"

# -----------------------------------------------
# ASISTENCIA
# -----------------------------------------------
class AttendanceRecord(models.Model):
    STATUS_CHOICES = [
        ('Present', 'Present'),
        ('Absent', 'Absent'),
        ('Permission', 'Permission'),
        ('Late', 'Late')
    ]

    worker = models.ForeignKey(Worker, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField()
    check_in = models.TimeField(blank=True, null=True)
    check_out = models.TimeField(blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Present')
    department = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"Asistencia de {self.worker.name} en {self.date}"

# -----------------------------------------------
# DOCUMENTOS
# -----------------------------------------------
class Document(models.Model):
    DOCUMENT_TYPE_CHOICES = [
        ('Contract', 'Contract'),
        ('Certificate', 'Certificate'),
        ('ID', 'ID'),
        # etc.
    ]

    worker = models.ForeignKey(Worker, on_delete=models.CASCADE, related_name='documents')
    name = models.CharField(max_length=200)   # Ejemplo: "Contrato", "CV"
    doc_type = models.CharField(max_length=50, choices=DOCUMENT_TYPE_CHOICES)
    upload_date = models.DateField()
    file_url = models.URLField(blank=True, null=True)  # o FileField / ImageField

    def __str__(self):
        return f"Doc {self.name} de {self.worker.name}"

# -----------------------------------------------
# INCIDENTES
# -----------------------------------------------
class Incident(models.Model):
    SEVERITY_CHOICES = [
        ('Baja', 'Baja'),
        ('Media', 'Media'),
        ('Alta', 'Alta'),
    ]

    worker = models.ForeignKey(Worker, on_delete=models.CASCADE, related_name='incidents')
    date = models.DateField()
    description = models.TextField()
    severity = models.CharField(max_length=5, choices=SEVERITY_CHOICES, default='Baja')
    corrective_action = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Incidente {self.id} de {self.worker.name}"

# -----------------------------------------------
# EVALUACIONES (NOTAS & OBSERVACIONES)
# -----------------------------------------------
class Evaluation(models.Model):
    worker = models.ForeignKey(Worker, on_delete=models.CASCADE, related_name='evaluations')
    date = models.DateField()
    rating = models.PositiveIntegerField()  # o DecimalField
    observations = models.TextField()

    def __str__(self):
        return f"Evaluación {self.id} de {self.worker.name}"

# -----------------------------------------------
# PAGOS (SALARIOS & BONOS)
# -----------------------------------------------
class Payment(models.Model):
    worker = models.ForeignKey(Worker, on_delete=models.CASCADE, related_name='payments')
    payment_date = models.DateField()
    base_salary = models.DecimalField(max_digits=12, decimal_places=2)
    bonuses = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    deductions = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    @property
    def total_paid(self):
        return self.base_salary + self.bonuses - self.deductions

    def __str__(self):
        return f"Pago {self.id} de {self.worker.name}"

# -----------------------------------------------
# ENTRENAMIENTOS
# -----------------------------------------------
class Training(models.Model):
    STATUS_CHOICES = [
        ('Pendiente', 'Pendiente'),
        ('En progreso', 'En progreso'),
        ('Completado', 'Completado'),
    ]

    worker = models.ForeignKey(Worker, on_delete=models.CASCADE, related_name='trainings')
    course_name = models.CharField(max_length=200)
    date = models.DateField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='Pendiente')

    def __str__(self):
        return f"Training {self.course_name} - {self.worker.name}"

# -----------------------------------------------
# VACACIONES Y PERMISOS
# -----------------------------------------------
class VacationOrPermission(models.Model):
    TYPE_CHOICES = [
        ('Vacation', 'Vacation'),
        ('Permission', 'Permission')
    ]

    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected')
    ]

    worker = models.ForeignKey(Worker, on_delete=models.CASCADE, related_name='vacations_permissions')
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='Vacation')
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=8, choices=STATUS_CHOICES, default='Pending')

    def __str__(self):
        return f"{self.type} de {self.worker.name} ({self.start_date} - {self.end_date})"
