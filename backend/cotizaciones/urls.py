from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CotizacionViewSet

router = DefaultRouter()
router.register(r'cotizaciones', CotizacionViewSet, basename='cotizacion')

urlpatterns = [
    path('', include(router.urls)),
]
