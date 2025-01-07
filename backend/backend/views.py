from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .serializers import UserSerializer

class UserViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """Listar todos los usuarios (solo para admin)."""
        if not request.user.is_superuser:
            return Response({"message": "Only admins can list users!"}, status=status.HTTP_403_FORBIDDEN)
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """Obtener detalles de un usuario."""
        try:
            user = User.objects.get(pk=pk)
            serializer = UserSerializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({"message": "User not found!"}, status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, pk=None):
        """Eliminar un usuario (autenticado o admin)."""
        if not request.user.is_authenticated:
            return Response({"message": "You are not authorized!"}, status=status.HTTP_401_UNAUTHORIZED)

        if pk:
            try:
                user = User.objects.get(pk=pk)
                if user.is_superuser:
                    return Response({"message": "You cannot delete an admin!"}, status=status.HTTP_403_FORBIDDEN)
                user.delete()
                return Response({"message": f"User {user.username} deleted!"}, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                return Response({"message": "User not found!"}, status=status.HTTP_404_NOT_FOUND)
        else:
            request.user.delete()
            return Response({"message": "Your account has been deleted!"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        """Login de usuario y retorno de token."""
        username = request.data.get('username')
        password = request.data.get('password')
        print(f"username: {username}, password: {password}")
        user = authenticate(username=username, password=password)
        print("el usuario post atuhenticate es " + str(user)) 



        if user:
            token, _ = Token.objects.get_or_create(user=user)
            serializer = UserSerializer(user)
            return Response({'token': token.key, "user": serializer.data}, status=status.HTTP_200_OK)
        return Response({"message": "username or password is incorrect!"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        """Registrar un nuevo usuario."""
        print("entro a register")
        print(request.data)
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token = Token.objects.create(user=user)
            return Response({'token': token.key, "user": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def profile(self, request):
        """Obtener perfil del usuario autenticado."""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def logout(self, request):
        """Cerrar sesión (eliminar token)."""
        request.user.auth_token.delete()
        return Response({"message": "logout!"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def get_current_user(self, request):
        """Obtener usuario autenticado."""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def update(self, request, pk=None):
        """Actualizar un usuario."""
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"message": "User not found!"}, status=status.HTTP_404_NOT_FOUND)

        # Validar que solo los superusuarios puedan cambiar roles
        if 'role_input' in request.data and not request.user.is_superuser:
            return Response({"message": "Only admins can change user roles!"}, status=status.HTTP_403_FORBIDDEN)

        serializer = UserSerializer(user, data=request.data, partial=True)  # Soporta PATCH
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
