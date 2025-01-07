from rest_framework import serializers
from .models import Certificado, PlasticoDetalle, FitosanitarioDetalle, MaterialDetalle

# Serial

class CertificadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificado
        fields = [
            'id',
            'folio',
            'categoria',
            'numero_certificado',
            'client',
            'fecha',
            'numero_guia',
            'destino_final',
            'file',  # Campo para almacenar el PDF generado
        ]

# class CertificadoSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Certificado
#         fields = '__all__'


# Serializer para Plásticos
class PlasticoDetalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlasticoDetalle
        fields = '__all__'


# Serializer para Fitosanitarios
class FitosanitarioDetalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = FitosanitarioDetalle
        fields = '__all__'


# Serializer para Materiales (Metales y Fibras)
class MaterialDetalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaterialDetalle
        fields = '__all__'
