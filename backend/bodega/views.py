from rest_framework.viewsets import ModelViewSet
from .models import Categoria, Marca, Producto, Stock
from .serializers import (
    CategoriaSerializer,
    MarcaSerializer,
    ProductoSerializer,
    StockSerializer,
)


class CategoriaViewSet(ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


class MarcaViewSet(ModelViewSet):
    queryset = Marca.objects.all()
    serializer_class = MarcaSerializer


class StockViewSet(ModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer


class ProductoViewSet(ModelViewSet):
    queryset = Producto.objects.prefetch_related("stocks").select_related(
        "categoria", "marca"
    )
    serializer_class = ProductoSerializer
