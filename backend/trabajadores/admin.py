from django.contrib import admin
from .models import (
    Trabajador, Asistencia, Nota, Documento,
    VacacionPermiso, PagoBeneficio, Capacitacion, Incidente
)

admin.site.register(Trabajador)
admin.site.register(Asistencia)
admin.site.register(Nota)
admin.site.register(Documento)
admin.site.register(VacacionPermiso)
admin.site.register(PagoBeneficio)
admin.site.register(Capacitacion)
admin.site.register(Incidente)

