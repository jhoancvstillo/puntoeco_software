from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import CustomUser
from .serializers import UserSerializer
from rest_framework.authtoken.models import Token
from .permissions import HasUsersAccess
from django.contrib.auth.models import Permission

PERMISSIONS = [
    "can_access_dashboard",
    "can_access_combustible",
    "can_access_fardos",
    "can_access_vertedero",
    "can_access_pesaje",
    "can_access_cotizacion",
    "can_access_disposicionfinal",
    "can_access_products",
    "can_access_trabajadores",
    "can_access_clientes",
    "can_access_finanzas",
    "can_access_configuracion",
]

class UserViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, HasUsersAccess]

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        """Authenticate user and return token."""
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return Response({"message": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = CustomUser.objects.filter(username=username).first()
        if user and user.check_password(password):
            token, _ = Token.objects.get_or_create(user=user)

            permissions = [
                perm.split('_')[-1]
                for perm in user.get_all_permissions()
                if perm.split('.')[-1] in PERMISSIONS
            ]

            return Response({
                "message": "Login successful.",
                "token": token.key,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": user.role,
                    "permissions": permissions
                },
            }, status=status.HTTP_200_OK)

        return Response({"message": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

    def list(self, request):
        """List all users (admins only)."""
        # if not request.user.is_superuser:
        #     return Response({"message": "Only admins can list users!"}, status=status.HTTP_403_FORBIDDEN)

        users = CustomUser.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """Get details of a specific user."""
        try:
            user = CustomUser.objects.get(pk=pk)
            serializer = UserSerializer(user)
            return Response(serializer.data)
        except CustomUser.DoesNotExist:
            return Response({"message": "User not found!"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        """Register a new user."""
        serializer = UserSerializer(data=request.data)
        
        # si el usuario no es admin, no puede registrar otro usuario
        
        if request.user.role != "admin":
            return Response({"message": "Only admins can register users!"}, status=status.HTTP_403_FORBIDDEN)
        
        if serializer.is_valid():
            user = serializer.save()
            token = Token.objects.create(user=user)
            return Response({
                "message": "User created successfully.",
                "token": token.key,
                "user": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        """Delete a user (admins only)."""
        if not request.user.is_superuser:
            return Response({"message": "Only admins can delete users!"}, status=status.HTTP_403_FORBIDDEN)

        try:
            user = CustomUser.objects.get(pk=pk)
            user.delete()
            return Response({"message": f"User {user.username} deleted!"}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({"message": "User not found!"}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, pk=None):
        """Update a specific user."""
        try:
            user = CustomUser.objects.get(pk=pk)
        except CustomUser.DoesNotExist:
            return Response({"message": "User not found!"}, status=status.HTTP_404_NOT_FOUND)
        
        
        # debe ser admin para poder actualizar a otro usuario o role==admin
        if not request.user.is_superuser and request.user.role != "admin":
            return Response({"message": "Only admins can update users!"}, status=status.HTTP_403_FORBIDDEN)
        
        
        

        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def profile(self, request):
        """Get profile of authenticated user."""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def logout(self, request):
        """Logout user by deleting their token."""
        request.user.auth_token.delete()
        return Response({"message": "Logout successful!"}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], url_path='get_current_user')
    def get_current_user(self, request):
        """Get details of the currently authenticated user."""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
 
    @action(detail=False, methods=['get'], url_path='permissions', permission_classes=[IsAuthenticated])
    def list_permissions(self, request):
        """
        List all permissions of the currently authenticated user.
        """
        # Obtener todos los permisos (directos y heredados por grupos)
        permissions = [
            perm.split('_')[-1]
            for perm in request.user.get_all_permissions()
            if perm.split('.')[-1] in PERMISSIONS
        ]
        return Response({
            "permissions": list(permissions)
        }, status=status.HTTP_200_OK)
