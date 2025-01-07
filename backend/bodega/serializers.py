from rest_framework import serializers
from .models import Categoria, Marca, Modelo, Producto, Stock

# Categoría
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'descripcion']


# Marca
class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
        fields = ['id', 'nombre', 'descripcion']


# Modelo
class ModeloSerializer(serializers.ModelSerializer):
    marca = serializers.PrimaryKeyRelatedField(queryset=Marca.objects.all())  # Acepta solo el ID de la marca

    class Meta:
        model = Modelo
        fields = ['id', 'nombre', 'descripcion', 'marca']


# Stock
class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ['id', 'ubicacion', 'cantidad', 'stock_minimo']


# Producto
class ProductoSerializer(serializers.ModelSerializer):
    # Input simplificado para creación y relación por ID
    categoria = serializers.PrimaryKeyRelatedField(queryset=Categoria.objects.all())
    marca = serializers.PrimaryKeyRelatedField(queryset=Marca.objects.all())
    modelo = serializers.PrimaryKeyRelatedField(queryset=Modelo.objects.all(), allow_null=True)
    stocks = StockSerializer(many=True)  # Permite datos anidados para stocks

    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'categoria', 'marca', 'modelo', 'precio_por_unidad', 'stocks']

    def create(self, validated_data):
        # Extrae datos de stocks del validated_data
        stocks_data = validated_data.pop('stocks', [])
        producto = Producto.objects.create(**validated_data)

        # Crea los registros relacionados en la tabla Stock
        for stock_data in stocks_data:
            Stock.objects.create(producto=producto, **stock_data)

        return producto

    def to_representation(self, instance):
        # Personaliza la salida para expandir datos relacionados
        representation = super().to_representation(instance)
        representation['categoria'] = CategoriaSerializer(instance.categoria).data
        representation['marca'] = MarcaSerializer(instance.marca).data
        representation['modelo'] = ModeloSerializer(instance.modelo).data if instance.modelo else None
        return representation