from rest_framework import serializers

from .models import Transaction, Classification, Subcategory

class FinanceSerializer(serializers.Serializer):
    fecha_hora = serializers.DateTimeField()
    tipo_transaccion = serializers.CharField()
    clasificacion = serializers.CharField()
    subcategoria = serializers.CharField()
    comentario = serializers.CharField()
    precio = serializers.FloatField()
    frecuencia = serializers.CharField()

    class Meta:
        fields = [
            'fecha_hora',
            'tipo_transaccion',
            'clasificacion',
            'subcategoria',
            'comentario',
            'precio',
            'frecuencia'
        ]

    def create(self, validated_data):
        print("validated_data", validated_data)
        return validated_data
    
class TransactionSerializer(serializers.ModelSerializer):
    # Si deseas permitir que el cliente envíe los nombres de clasificación y subcategoría en lugar de IDs, puedes hacer lo siguiente:
    classification = serializers.SlugRelatedField(slug_field='name', queryset=Classification.objects.all())
    subcategory = serializers.SlugRelatedField(slug_field='name', queryset=Subcategory.objects.all())

    class Meta:
        model = Transaction
        fields = ['date_time', 'transaction_type', 'classification', 'subcategory', 'frequency', 'comment', 'price']
