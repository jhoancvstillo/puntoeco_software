from rest_framework import viewsets
from .models import Combustible
from .serializers import CombustibleSerializer

from rest_framework.response import Response
from rest_framework import status
from .permissions import HasCombustibleAccess


class CombustibleViewSet(viewsets.ModelViewSet):
    permission_classes = [HasCombustibleAccess]
    queryset = Combustible.objects.all()
    serializer_class = CombustibleSerializer

    def create(self, request, *args, **kwargs):
        if isinstance(request.data, list):  # Verifica si el cuerpo del request es una lista
            serializers = self.get_serializer(data=request.data, many=True)
            serializers.is_valid(raise_exception=True)
            self.perform_bulk_create(serializers)
            return Response(serializers.data, status=status.HTTP_201_CREATED)
        else:
            return super().create(request, *args, **kwargs)

    def perform_bulk_create(self, serializers):
        serializers.save()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()  # Obtén la instancia del objeto a eliminar
        self.perform_destroy(instance)
        return Response(
            {"detail": "Combustible record deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )

    def perform_destroy(self, instance):
        # Aquí puedes agregar lógica personalizada antes de eliminar el objeto
        instance.delete()
