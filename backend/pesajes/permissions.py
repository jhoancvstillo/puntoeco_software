from rest_framework.permissions import BasePermission

class HasPesajesAccess(BasePermission):
    
    def has_permission(self, request, view):
        return request.user.has_perm('users.can_access_pesaje')
    