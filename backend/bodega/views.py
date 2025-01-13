from rest_framework.viewsets import ModelViewSet
from .models import Categoria, Marca, Producto, Stock
from .serializers import (
    CategoriaSerializer,
    MarcaSerializer,
    ProductoSerializer,
    StockSerializer,
    StockMovementSerializer,
)
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import StockMovement


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


class StockMovementViewSet(ModelViewSet):
    """
    ViewSet para manejar movimientos de inventario.
    """
    permission_classes = [IsAuthenticated]  # o la que necesites
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer

    def create(self, request, *args, **kwargs):
        """
        Sobrescribimos el método create para manejar el formulario del frontend.
        """
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        movement = serializer.save()  # Se ejecuta la lógica de creación en el serializer
        
        return Response(
            self.get_serializer(movement).data,
            status=status.HTTP_201_CREATED
        )
