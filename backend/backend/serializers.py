# from rest_framework import serializers
# from django.contrib.auth.models import User

# class UserSerializer(serializers.ModelSerializer):
#     role = serializers.SerializerMethodField()  # Calculado para el GET
#     role_input = serializers.CharField(write_only=True, required=False)  # Para el POST

#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'password', 'role', 'role_input']
#         extra_kwargs = {
#             'password': {'write_only': True},  # Ocultar contraseña en la respuesta
#             'email': {'required': True}  # Hacer que el email sea obligatorio
#         }

#     def validate_password(self, value):
#         """Validar que la contraseña tenga al menos 8 caracteres."""
#         if len(value) < 8:
#             raise serializers.ValidationError("La contraseña debe tener al menos 8 caracteres.")
#         return value

#     def validate_email(self, value):
#         """Validar que el email sea único excepto para el usuario actual."""
#         user_id = self.instance.id if self.instance else None
#         if User.objects.filter(email=value).exclude(id=user_id).exists():
#             raise serializers.ValidationError("Este email ya está en uso.")
#         return value

#     def validate_username(self, value):
#         """Validar que el nombre de usuario sea único excepto para el usuario actual."""
#         user_id = self.instance.id if self.instance else None  # Identificar al usuario actual
#         if User.objects.filter(username=value).exclude(id=user_id).exists():
#             raise serializers.ValidationError("Este nombre de usuario ya está en uso.")
#         return value
    
#     def validate_role_input(self, value):
#         """Validar que el rol sea válido."""
#         valid_roles = ['admin', 'normal']  # Roles permitidos
#         if value not in valid_roles:
#             raise serializers.ValidationError(f"El rol debe ser uno de los siguientes: {', '.join(valid_roles)}")
#         return value


#     def create(self, validated_data):
#         """Sobrescribir el método create para cifrar la contraseña."""
#         role = validated_data.pop('role_input', 'normal')  # Default role: normal

#         password = validated_data.pop('password')
#         user = User(**validated_data)
#         user.set_password(password)  # Cifrar la contraseña
#         user.is_superuser = role == 'admin'  # Asignar permisos según el rol
#         user.is_staff = role == 'admin'
#         user.save()
#         return user
    
#     def get_role(self, obj):
#         """Devuelve el rol del usuario (superuser o normal)."""
#         return "admin" if obj.is_superuser else "normal"

#     def update(self, instance, validated_data):
#         """Actualizar el usuario, incluyendo su rol."""
#         role = validated_data.pop('role_input', None)
#         if role:
#             instance.is_superuser = role == 'admin'
#             instance.is_staff = role == 'admin'
        
#         for attr, value in validated_data.items():
#             if attr == 'password':  # Cifrar contraseña si se envía
#                 instance.set_password(value)
#             else:
#                 setattr(instance, attr, value)
        
#         instance.save()
#         return instance
