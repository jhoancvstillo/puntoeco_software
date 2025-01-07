
#admin.py

from django.contrib import admin
from .models import Conductor, Certificado

# Register your models here.
admin.site.register(Conductor)
admin.site.register(Certificado)