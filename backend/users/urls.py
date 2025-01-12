from rest_framework.routers import DefaultRouter
from .views import UserViewSet

from django.urls import path, include
from django.http import JsonResponse

def users_root_view(request):
    return JsonResponse({
        "message": "Welcome to the Users API. Use specific endpoints to access data."
    })
    

router = DefaultRouter()
router.register(r'', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('', users_root_view, name='users-root'),
]
