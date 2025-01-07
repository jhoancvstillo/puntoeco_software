from rest_framework import serializers
from .models import Clients, Conductor


class ClientsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clients
        fields = [
            'id', 
            'name', 
            'mail', 
            'phoneNumber', 
            'address', 
            'rut', 
        ]
        read_only_fields = ['id']


class ConductorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conductor
        fields = ['id', 'nombre', 'rut', 'cliente']
