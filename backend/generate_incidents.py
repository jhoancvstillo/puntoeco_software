from hr.models import Worker, Incident
from datetime import date, timedelta
import random

# Datos iniciales
workers = Worker.objects.all()

# Opciones de incidentes
severities = ['Baja', 'Media', 'Alta']
descriptions = [
    "Llegada tarde reiterada",
    "Conflicto con compañero",
    "Fallo en la entrega de un proyecto",
    "Uso inadecuado de recursos",
    "Incumplimiento de normas de seguridad"
]
corrective_actions = [
    "Capacitación sobre puntualidad",
    "Mediación en Recursos Humanos",
    "Reasignación de tareas",
    "Capacitación sobre normas",
    "Advertencia formal"
]

# Generar incidentes aleatorios para cada trabajador
incidents = []

for worker in workers:
    for _ in range(2):  # Dos incidentes por trabajador
        date_offset = random.randint(1, 365)  # Día aleatorio en el último año
        incident_date = date.today() - timedelta(days=date_offset)
        description = random.choice(descriptions)
        severity = random.choice(severities)
        corrective_action = random.choice(corrective_actions)

        # Crear instancia de Incident
        incident = Incident(
            worker=worker,
            date=incident_date,
            description=description,
            severity=severity,
            corrective_action=corrective_action
        )
        incidents.append(incident)

# Guardar en la base de datos
Incident.objects.bulk_create(incidents)

print(f"Generated {len(incidents)} random incidents for workers.")
