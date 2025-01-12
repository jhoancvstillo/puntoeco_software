from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CombustibleViewSet
from django.http import JsonResponse


def combustible_root_view(request):
    return JsonResponse({
        "message": "Welcome to the Combustible API. Use specific endpoints to access data."
    })
    

router = DefaultRouter()
router.register(r'combustible', CombustibleViewSet)




urlpatterns = [
    path('', include(router.urls)),
    path('', combustible_root_view, name='combustible-root'),
    
]
