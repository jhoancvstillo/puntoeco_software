from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CotizacionViewSet
from django.http import JsonResponse


def cotizaciones_root_view(request):
    return JsonResponse({
        "message": "Welcome to the Cotizaciones API. Use specific endpoints to access data."
    })
    

router = DefaultRouter()
router.register(r'cotizaciones', CotizacionViewSet, basename='cotizacion')

urlpatterns = [
    path('', include(router.urls)),
    path('', cotizaciones_root_view, name='cotizaciones-root'),
]
