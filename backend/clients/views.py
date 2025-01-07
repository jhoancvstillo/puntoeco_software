from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from .serializers import ClientsSerializer, ConductorSerializer
from .models import Clients, Conductor
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination

# Configuración de paginación personalizada (opcional)
class CustomPagination(PageNumberPagination):
    page_size = 10  # Número de elementos por página
    page_size_query_param = 'page_size'

class ClientsViewSet(ModelViewSet):
    queryset = Clients.objects.all()
    serializer_class = ClientsSerializer
    pagination_class = CustomPagination

    # Filtro personalizado basado en parámetros de consulta
    def get_queryset(self):
        filter_text = self.request.query_params.get('filter', '')
        queryset = super().get_queryset()
        if filter_text:
            queryset = queryset.filter(Q(name__icontains=filter_text) | Q(rut__icontains=filter_text))
        return queryset

    # Acción personalizada para obtener los conductores asociados a un cliente
    @action(detail=True, methods=['get'], url_path='conductor')
    def get_conductors(self, request, pk=None):
        """
        Devuelve los conductores asociados al cliente con el id proporcionado.
        """
        try:
            client = self.get_object()  # Verifica que este cliente exista
            conductors = Conductor.objects.filter(cliente=client)
            if not conductors.exists():
                return Response({"detail": "No conductors found for this client."}, status=status.HTTP_404_NOT_FOUND)
            serializer = ConductorSerializer(conductors, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Clients.DoesNotExist:
            return Response({"detail": "Client not found."}, status=status.HTTP_404_NOT_FOUND)

class ClientsNormal(ModelViewSet):
    queryset = Clients.objects.all()
    serializer_class = ClientsSerializer

class ConductorViewSet(ModelViewSet):
    queryset = Conductor.objects.all()
    serializer_class = ConductorSerializer

    # Filtro personalizado basado en parámetros de consulta
    def get_queryset(self):
        filter_text = self.request.query_params.get('filter', '')
        queryset = super().get_queryset()
        if filter_text:
            queryset = queryset.filter(Q(nombre__icontains=filter_text) | Q(rut__icontains=filter_text))
        return queryset
