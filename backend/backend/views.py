from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserSerializer
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.contrib.auth import authenticate


@api_view(['POST'])
def login(request):

    print("request.data", request.data)
    username = request.data['username']
    password = request.data['password']
    user = authenticate(username=username, password=password)
    if user is not None:
        token, created = Token.objects.get_or_create(user=user)
        serializer = UserSerializer(instance = user)
        print("serializer.data", serializer.data)
        return Response({'token': token.key, "user": serializer.data}, status =status.HTTP_200_OK)
    else:
        print("username or password is incorrect!")
        return Response({"message": "username or password is incorrect!"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(username=serializer.data['username'])
        user.save()

        token = Token.objects.create(user=user) 
        return Response({'token': token.key, "user": serializer.data}, status =status.HTTP_201_CREATED) 
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def profile(request):
    return Response({"message": "profile!"})


@api_view(['POST'])
def delete(request):
    return Response({"message": "delete!"})