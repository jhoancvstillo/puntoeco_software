from rest_framework.permissions import BasePermission

class HasClientsAccess(BasePermission):
    """
    Permite el acceso a la API solo a usuarios con el permiso `can_access_clients`.
    """
    def has_permission(self, request, view):
        # Validar si el usuario tiene el permiso `app_label.can_access_clients`
        return request.user.has_perm('users.can_access_clientes')
    
    
class HasClientOrPesajeAccess(BasePermission):
    def has_permission(self, request, view):
        return request.user.has_perm('users.can_access_clientes') or request.user.has_perm('users.can_access_pesaje')
    