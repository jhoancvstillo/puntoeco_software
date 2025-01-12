from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VertederoViewSet
from django.http import JsonResponse

def vertedero_root_view(request):
    return JsonResponse({
        "message": "Welcome to the Vertedero API. Use specific endpoints to access data."
    })
    


router = DefaultRouter()
router.register(r'vertedero', VertederoViewSet, basename='vertedero')

urlpatterns = [
    path('', include(router.urls)),
    path('', vertedero_root_view, name='vertedero-root'),
]
