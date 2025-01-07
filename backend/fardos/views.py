from django.db import models  # Importa 'models' aquí
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Production, Dispatch, Debt
from .serializers import ProductionSerializer, DispatchSerializer, DebtSerializer

class ProductionViewSet(viewsets.ModelViewSet):
    queryset = Production.objects.all()
    serializer_class = ProductionSerializer

class DispatchViewSet(viewsets.ModelViewSet):
    queryset = Dispatch.objects.all()
    serializer_class = DispatchSerializer

    @action(detail=False, methods=['get'])
    def latest(self, request):
        """Fetch the latest dispatch"""
        latest_dispatch = self.queryset.order_by('-date').first()
        serializer = self.get_serializer(latest_dispatch)
        return Response(serializer.data)

class DebtViewSet(viewsets.ModelViewSet):
    queryset = Debt.objects.all()
    serializer_class = DebtSerializer

    @action(detail=False, methods=['get'])
    def pending_total(self, request):
        """Fetch the total pending weight"""
        total_pending = Debt.get_total_pending_weight()
        return Response({'total_pending_weight': total_pending})
