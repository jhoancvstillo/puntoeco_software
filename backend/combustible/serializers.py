from rest_framework import serializers
from .models import Combustible
from clients.models import Conductor

class CombustibleSerializer(serializers.ModelSerializer):
    conductor_nombre = serializers.CharField(source='conductor.nombre', read_only=True)
    conductor_rut = serializers.CharField(source='conductor.rut', read_only=True)

    class Meta:
        model = Combustible
        fields = [
            'id', 'fecha', 'hora', 'patente', 'conductor', 
            'conductor_nombre', 'conductor_rut', 'litros', 
            'valor_litro', 'total', 'tarjeta', 'guia', 'observaciones'
        ]
        read_only_fields = ['total']  # 'total' is calculated automatically
