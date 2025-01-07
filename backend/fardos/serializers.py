from rest_framework import serializers
from .models import Production, Dispatch, Debt

class ProductionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Production
        fields = '__all__'
        read_only_fields = ('estimated_weight',)

class DispatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dispatch
        fields = '__all__'
        read_only_fields = ('weight',)  # Hacer 'weight' de solo lectura


class DebtSerializer(serializers.ModelSerializer):
    class Meta:
        model = Debt
        fields = '__all__'
