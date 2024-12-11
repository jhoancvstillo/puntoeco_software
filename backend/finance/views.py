from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import TransactionSerializer
from .models import Transaction

@api_view(['POST'])
def finance_create(request):
    serializer = TransactionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()  # Guarda en la base de datos
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def finance_list(request):
    transactions = Transaction.objects.all()
    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data)