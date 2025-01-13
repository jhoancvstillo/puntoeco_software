from rest_framework import serializers
from django.contrib.auth.models import Permission
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    # Campo para recibir permisos en formato de objeto con valores booleanos
    permisos = serializers.DictField(
        child=serializers.BooleanField(),
        required=False,
        write_only=True,
        help_text="Diccionario de permisos en formato {'dashboard': true, 'combustible': false, ...}."
    )

    # Campo para mostrar los permisos asignados al usuario (read only)
    permisos_asignados = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ["id", "username", "email", "role", "password", "permisos", "permisos_asignados"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_password(self, value):
        """Validar que la contraseña tenga al menos 8 caracteres."""
        if len(value) < 8:
            raise serializers.ValidationError("La contraseña debe tener al menos 8 caracteres.")
        return value

    def validate_email(self, value):
        """Validar que el email sea único excepto para el usuario actual."""
        user_id = self.instance.id if self.instance else None
        if CustomUser.objects.filter(email=value).exclude(id=user_id).exists():
            raise serializers.ValidationError("Este email ya está en uso.")
        return value

    def validate_username(self, value):
        """Validar que el nombre de usuario sea único excepto para el usuario actual."""
        user_id = self.instance.id if self.instance else None  # Identificar al usuario actual
        if CustomUser.objects.filter(username=value).exclude(id=user_id).exists():
            raise serializers.ValidationError("Este nombre de usuario ya está en uso.")
        return value

    def get_permisos_asignados(self, obj):
        """
        Retorna la lista de codenames de los permisos que el usuario tiene asignados.
        """
        return list(obj.user_permissions.values_list("codename", flat=True))

    def create(self, validated_data):
        permisos = validated_data.pop("permisos", {})  # Recibe permisos como diccionario de booleanos
        password = validated_data.pop("password", None)
        role = validated_data.get("role", "user")  # Obtener el rol del usuario

        # Si el rol es 'admin', configurar automáticamente los campos is_staff e is_superuser
        if role == "admin":
            validated_data["is_staff"] = True
            validated_data["is_superuser"] = True

        user = CustomUser(**validated_data)
        if password:
            user.set_password(password)
        user.save()

        # Si el rol es admin, asignar todos los permisos
        if role == "admin":
            all_permissions = Permission.objects.all()
            user.user_permissions.set(all_permissions)
        else:
            # Asignar permisos en función del diccionario de permisos booleanos
            self.assign_permissions(user, permisos)

        return user


    def update(self, instance, validated_data):
        permisos = validated_data.pop("permisos", {})
        password = validated_data.pop("password", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()

        # Actualizar permisos
        self.assign_permissions(instance, permisos)

        return instance

    def assign_permissions(self, user, permisos):
        """
        Asigna permisos al usuario según el diccionario recibido.
        """
        codenames = {
            "dashboard": "can_access_dashboard",
            "combustible": "can_access_combustible",
            "fardos": "can_access_fardos",
            "vertedero": "can_access_vertedero",
            "pesaje": "can_access_pesaje",
            "cotizacion": "can_access_cotizacion",
            "disposicionfinal": "can_access_disposicionfinal",
            "products": "can_access_products",
            "trabajadores": "can_access_trabajadores",
            "clientes": "can_access_clientes",
            "finanzas": "can_access_finanzas",
            "configuracion": "can_access_configuracion",
        }

        # Remover todos los permisos asignados previamente
        user.user_permissions.clear()

        # Asignar permisos en función de los valores booleanos
        for key, value in permisos.items():
            if value:  # Si el valor es True, asignar el permiso correspondiente
                codename = codenames.get(key)
                if codename:
                    try:
                        permission = Permission.objects.get(codename=codename)
                        user.user_permissions.add(permission)
                    except Permission.DoesNotExist:
                        raise ValueError(f"Permission '{codename}' does not exist.")

