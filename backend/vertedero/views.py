from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from .models import Vertedero
from .serializers import VertederoSerializer

class VertederoViewSet(viewsets.ModelViewSet):
    """
    API ViewSet for Vertedero model.
    """
    queryset = Vertedero.objects.all()
    serializer_class = VertederoSerializer

    @action(detail=False, methods=['get'], url_path='totals')
    def totals(self, request):
        """
        Custom action to retrieve total weight and value.
        """
        total_weight = self.queryset.aggregate(Sum('weight_kg'))['weight_kg__sum'] or 0
        total_value = self.queryset.aggregate(Sum('value'))['value__sum'] or 0
        return Response({'total_weight_kg': total_weight, 'total_value': total_value})
