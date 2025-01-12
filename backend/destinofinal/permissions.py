from rest_framework.permissions import BasePermission

class HasDestinoFinalAccess(BasePermission):
    """
    Permite el acceso a la API solo a usuarios con el permiso `can_access_destinofinal`.
    """
    def has_permission(self, request, view):
        # Validar si el usuario tiene el permiso `app_label.can_access_destinofinal`
        return request.user.has_perm('users.can_access_disposicionfinal')