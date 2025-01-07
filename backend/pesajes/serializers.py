from rest_framework import serializers
from clients.models import Clients, Conductor  # Importamos los modelos necesarios de clients
from .models import Certificado

# Serializer para Conductores
class ConductorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conductor
        fields = '__all__'

# Serializer para Clientes
class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clients
        fields = '__all__'

# Serializer para Certificados de Pesaje
class CertificadoPesajeSerializer(serializers.ModelSerializer):
    cliente = serializers.PrimaryKeyRelatedField(queryset=Clients.objects.all())  # Solo ID en POST
    conductor = serializers.PrimaryKeyRelatedField(queryset=Conductor.objects.all())  # Solo ID en POST

    patente = serializers.CharField(required=False)

    class Meta:
        model = Certificado
        fields = [
            'id',
            'codigo_producto',
            'dispatch_guide',
            'tipo_camion',
            'cliente',       # Usará un dict en GET, pero solo un ID en POST
            'conductor',     # Usará un dict en GET, pero solo un ID en POST
            'patente',
            'fecha',
            'hora_ingreso',
            'hora_salida',
            'peso_1',
            'peso_2',
            'pdf_ticket',
        ]

    def to_representation(self, instance):
        """Sobrescribimos la representación del serializer para GET"""
        representation = super().to_representation(instance)

        # Serializamos cliente y conductor con sus serializers completos
        representation['cliente'] = ClienteSerializer(instance.cliente).data
        representation['conductor'] = ConductorSerializer(instance.conductor).data

        return representation

    def create(self, validated_data):
        return Certificado.objects.create(**validated_data)
