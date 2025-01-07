from rest_framework import serializers
from .models import (
    Trabajador, Asistencia, PagoBeneficio, Nota, Documento,
    VacacionPermiso, Capacitacion, Incidente
)

class TrabajadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trabajador
        fields = '__all__'

class AsistenciaSerializer(serializers.ModelSerializer):
    worker = TrabajadorSerializer()

    class Meta:
        model = Asistencia
        fields = '__all__'

class PagoBeneficioSerializer(serializers.ModelSerializer):
    worker = serializers.PrimaryKeyRelatedField(queryset=Trabajador.objects.all())

    class Meta:
        model = PagoBeneficio
        fields = '__all__'

class NotaSerializer(serializers.ModelSerializer):
    # En lugar de worker = TrabajadorSerializer()
    worker = serializers.PrimaryKeyRelatedField(queryset=Trabajador.objects.all())

    class Meta:
        model = Nota
        fields = '__all__'

class DocumentoSerializer(serializers.ModelSerializer):
    # worker = TrabajadorSerializer()
    worker = serializers.PrimaryKeyRelatedField(queryset=Trabajador.objects.all())


    class Meta:
        model = Documento
        fields = '__all__'

class VacacionPermisoSerializer(serializers.ModelSerializer):
    worker = serializers.PrimaryKeyRelatedField(queryset=Trabajador.objects.all())


    class Meta:
        model = VacacionPermiso
        fields = '__all__'

class CapacitacionSerializer(serializers.ModelSerializer):
    worker = serializers.PrimaryKeyRelatedField(queryset=Trabajador.objects.all())

    class Meta:
        model = Capacitacion
        fields = '__all__'

class IncidenteSerializer(serializers.ModelSerializer):
    worker = serializers.PrimaryKeyRelatedField(queryset=Trabajador.objects.all())

    class Meta:
        model = Incidente
        fields = '__all__'
