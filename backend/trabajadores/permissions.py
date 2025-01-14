from rest_framework.permissions import BasePermission

class HasTrabajadoresAccess(BasePermission):
    """
    Permite el acceso a la API solo a usuarios con el permiso `can_access_trabajadores`.
    """
    def has_permission(self, request, view):
        # Validar si el usuario tiene el permiso `app_label.can_access_trabajadores`
        return request.user.has_perm('users.can_access_trabajadores')
    
    
class HasTrabajadorOrCombustibleAcess(BasePermission):
    def has_permission(self, request, view):
        return request.user.has_perm('users.can_access_trabajadores') or request.user.has_perm('users.can_access_combustible')