from rest_framework import serializers
from .models import Cotizacion, DetalleCotizacion
from trabajadores.models import Trabajador
from clients.models import Clients

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clients
        fields = '__all__'

class WorkerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trabajador
        fields = '__all__'

class DetalleCotizacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleCotizacion
        fields = ['id', 'description', 'value']

class CotizacionSerializer(serializers.ModelSerializer):
    # Serializadores dinámicos para POST (usar solo IDs) y GET (usar objetos completos)
    client = serializers.PrimaryKeyRelatedField(queryset=Clients.objects.all())
    worker = serializers.PrimaryKeyRelatedField(queryset=Trabajador.objects.all())
    detalles = DetalleCotizacionSerializer(many=True)

    class Meta:
        model = Cotizacion
        fields = [
            'id',
            'client',
            'requested_by',
            'worker',
            'date_time',
            'pdf_cotizacion',
            'detalles',
        ]

    def to_representation(self, instance):
        """
        Sobrescribir la representación para que en GET devuelva los objetos completos.
        """
        representation = super().to_representation(instance)
        representation['client'] = ClientSerializer(instance.client).data
        representation['worker'] = WorkerSerializer(instance.worker).data
        return representation

    def create(self, validated_data):
        detalles_data = validated_data.pop('detalles', [])
        # Crear la cotización directamente con IDs para client y worker
        cotizacion = Cotizacion.objects.create(**validated_data)

        # Crear detalles relacionados
        for detalle in detalles_data:
            DetalleCotizacion.objects.create(cotizacion=cotizacion, **detalle)

        return cotizacion

    def update(self, instance, validated_data):
        detalles_data = validated_data.pop('detalles', [])
        # Actualizar client y worker si están presentes
        if 'client' in validated_data:
            instance.client = validated_data.pop('client')
        if 'worker' in validated_data:
            instance.worker = validated_data.pop('worker')

        # Actualizar otros campos
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Actualizar detalles
        instance.detalles.all().delete()  # Eliminar los detalles existentes
        for detalle in detalles_data:
            DetalleCotizacion.objects.create(cotizacion=instance, **detalle)

        return instance
