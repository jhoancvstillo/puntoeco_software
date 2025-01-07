from rest_framework.viewsets import ModelViewSet
from .serializers import TransactionSerializer
from .models import Transaction
from .models import Classification, Subcategory
from .serializers import ClassificationSerializer, SubcategorySerializer
from rest_framework.decorators import action



class ClassificationViewSet(ModelViewSet):
    queryset = Classification.objects.all()
    serializer_class = ClassificationSerializer

    @action(detail=True, methods=['get'])
    def subcategories(self, request, pk=None):
        classification = self.get_object()
        subcategories = classification.subcategories.all()
        serializer = SubcategorySerializer(subcategories, many=True)
        return Response(serializer.data)

class SubcategoryViewSet(ModelViewSet):
    queryset = Subcategory.objects.all()
    serializer_class = SubcategorySerializer

class TransactionViewSet(ModelViewSet):
    """
    ViewSet for managing transactions.
    Supports all CRUD operations (Create, Read, Update, Delete).
    """
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

