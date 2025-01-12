from rest_framework.permissions import BasePermission

class HasUsersAccess(BasePermission):
    """
    Permite el acceso a la API solo a usuarios con el permiso `can_access_users`.
    """
    def has_permission(self, request, view):
        # Validar si el usuario tiene el permiso `app_label.can_access_users`
        return request.user.has_perm('users.can_access_configuracion')