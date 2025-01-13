from rest_framework import serializers
from .models import Categoria, Marca, Producto,  Stock, StockMovement

from django.shortcuts import get_object_or_404

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
    stocks = StockSerializer(many=True)  # Permite datos anidados para stocks

    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'categoria', 'marca', 'precio_por_unidad', 'stocks']

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
        return representation


class StockMovementSerializer(serializers.ModelSerializer):
    """
    Serializador para manejar movimientos de inventario con información adicional.
    """
    productoId = serializers.IntegerField(write_only=True)
    tipo = serializers.ChoiceField(choices=['add', 'remove'], write_only=True)
    cantidad = serializers.IntegerField(write_only=True)
    observacion = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = StockMovement
        fields = [
            'id', 'producto', 'stock_afectado', 'user', 'movement_type', 'quantity',
            'observation', 'created_at', 'productoId', 'tipo', 'cantidad', 'observacion'
        ]
        read_only_fields = ['id', 'producto', 'stock_afectado', 'user', 'movement_type', 
                            'quantity', 'observation', 'created_at']

    def create(self, validated_data):
        """
        Lógica para registrar el movimiento de inventario.
        """
        producto_id = validated_data.pop('productoId')
        tipo = validated_data.pop('tipo')
        cantidad = validated_data.pop('cantidad')
        observacion = validated_data.pop('observacion', '')

        producto = Producto.objects.get(pk=producto_id)

        # Obtener el stock asociado al producto
        stock = producto.stocks.first()
        if not stock:
            raise serializers.ValidationError("No hay stock registrado para este producto.")

        # Actualizar stock
        if tipo == 'add':
            stock.cantidad += cantidad
        elif tipo == 'remove':
            if cantidad > stock.cantidad:
                raise serializers.ValidationError("No hay suficiente stock para realizar esta operación.")
            stock.cantidad -= cantidad

        stock.save()

        # Registrar el movimiento
        movement = StockMovement.objects.create(
            producto=producto,
            stock_afectado=stock,
            user=self.context['request'].user,  # Usuario autenticado
            movement_type=tipo,
            quantity=cantidad,
            observation=observacion
        )

        return movement

    def to_representation(self, instance):
        """
        Personalizar la salida para incluir datos adicionales del producto.
        """
        representation = super().to_representation(instance)
        producto = instance.producto
        representation['producto'] = {
            'id': producto.id,
            'nombre': producto.nombre,
            'marca': {
                'id': producto.marca.id,
                'nombre': producto.marca.nombre
            },
            'categoria': {
                'id': producto.categoria.id,
                'nombre': producto.categoria.nombre
            }
        }
        representation['ubicacion'] = instance.stock_afectado.ubicacion
        representation['user'] = instance.user.username if instance.user else None
        return representation
