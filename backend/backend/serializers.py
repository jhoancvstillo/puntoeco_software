from rest_framework import serializers
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True},  # Ocultar contraseña en la respuesta
            'email': {'required': True}  # Hacer que el email sea obligatorio
        }

    def validate_password(self, value):
        """Validar que la contraseña tenga al menos 8 caracteres."""
        if len(value) < 8:
            raise serializers.ValidationError("La contraseña debe tener al menos 8 caracteres.")
        return value

    def validate_email(self, value):
        """Validar que el email sea único."""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este email ya está en uso.")
        return value

    def validate_username(self, value):
        """Validar que el nombre de usuario sea único."""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Este nombre de usuario ya está en uso.")
        return value

    def create(self, validated_data):
        """Sobrescribir el método create para cifrar la contraseña."""
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)  # Cifrar la contraseña
        user.save()
        return user
