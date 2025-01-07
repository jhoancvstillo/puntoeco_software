from rest_framework import serializers
from .models import Vertedero

class VertederoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vertedero
        fields = ['id', 'date', 'weight_kg', 'value']
