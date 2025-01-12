from django.contrib.auth.models import AbstractUser, Permission
from django.db import models
from django.contrib.auth.models import BaseUserManager
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission

ROLE_PERMISSIONS = {
    "admin": [
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
    ],
    "user": [
        "can_access_dashboard",
    ],
}


class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        
        # Si no se pasa un 'role', lo forzamos a "user"
        extra_fields.setdefault("role", "user")
        
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        # Asigna permisos en función del rol
        role = extra_fields.get("role")
        if role and role in ROLE_PERMISSIONS:
            user.assign_permissions(ROLE_PERMISSIONS[role])
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", "admin")  # Rol 'admin'

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        # Primero creamos el usuario con la lógica normal
        user = self.create_user(username, email, password, **extra_fields)

        # Luego, como es superusuario, le damos absolutamente todos los permisos 
        # (relacionados con SidebarItem o, si deseas, de todo el sistema).
        all_permissions = Permission.objects.all()
        user.user_permissions.set(all_permissions)
        user.save(using=self._db)

        return user


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=20,
        choices=[("admin", "Admin"), ("user", "User")],
        default="user",
    )

    objects = CustomUserManager()  # Importante

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.is_superuser:
            all_permissions = Permission.objects.all()
            self.user_permissions.set(all_permissions)

    def assign_permissions(self, permisos):
        """Asignar permisos a un usuario."""
        for permiso in permisos:
            try:
                permission = Permission.objects.get(codename=permiso)
                self.user_permissions.add(permission)

            except Permission.DoesNotExist:
                raise ValueError(f"Permission '{permiso}' does not exist.")

    class Meta:
        permissions = [
            ("can_access_dashboard", "Can access dashboard"),
            ("can_access_combustible", "Can access combustible"),
            ("can_access_fardos", "Can access fardos"),
            ("can_access_vertedero", "Can access vertedero"),
            ("can_access_pesaje", "Can access pesaje"),
            ("can_access_cotizacion", "Can access cotizacion"),
            ("can_access_disposicionfinal", "Can access disposicion final"),
            ("can_access_products", "Can access products"),
            ("can_access_trabajadores", "Can access trabajadores"),
            ("can_access_clientes", "Can access clientes"),
            ("can_access_finanzas", "Can access finanzas"),
            ("can_access_configuracion", "Can access configuracion"),
        ]

    def __str__(self):
        return self.username

