from rest_framework.permissions import BasePermission

class HasFardosAccess(BasePermission):
    """
    Permite el acceso a la API solo a usuarios con el permiso `can_access_fardos`.
    """
    def has_permission(self, request, view):
        # Validar si el usuario tiene el permiso `app_label.can_access_fardos`
        return request.user.has_perm('users.can_access_fardos')