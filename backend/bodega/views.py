from rest_framework.viewsets import ModelViewSet
from .models import Categoria, Marca, Producto, Stock
from .serializers import (
    CategoriaSerializer,
    MarcaSerializer,
    ProductoSerializer,
    StockSerializer,
)

from .permissions import HasBodegaAccess


class CategoriaViewSet(ModelViewSet):
    permission_classes = [HasBodegaAccess]
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


class MarcaViewSet(ModelViewSet):
    permission_classes = [HasBodegaAccess]
    queryset = Marca.objects.all()
    serializer_class = MarcaSerializer


class StockViewSet(ModelViewSet):
    permission_classes = [HasBodegaAccess]
    queryset = Stock.objects.all()
    serializer_class = StockSerializer


class ProductoViewSet(ModelViewSet):
    permission_classes = [HasBodegaAccess]
    queryset = Producto.objects.prefetch_related("stocks").select_related(
        "categoria", "marca"
    )
    serializer_class = ProductoSerializer
