from rest_framework.viewsets import ModelViewSet
from .models import Categoria, Marca, Modelo, Producto, Stock
from .serializers import (
    CategoriaSerializer,
    MarcaSerializer,
    ModeloSerializer,
    ProductoSerializer,
    StockSerializer,
)


class CategoriaViewSet(ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


class MarcaViewSet(ModelViewSet):
    queryset = Marca.objects.all()
    serializer_class = MarcaSerializer


class ModeloViewSet(ModelViewSet):
    queryset = Modelo.objects.all()
    serializer_class = ModeloSerializer


class StockViewSet(ModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer


class ProductoViewSet(ModelViewSet):
    queryset = Producto.objects.prefetch_related("stocks").select_related(
        "categoria", "marca", "modelo"
    )
    serializer_class = ProductoSerializer
