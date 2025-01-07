from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ConductorViewSet, CertificadoPesajeViewSet

router = DefaultRouter()
router.register(r'conductores', ConductorViewSet, basename='conductor')
router.register(r'certificados', CertificadoPesajeViewSet, basename='certificado')

urlpatterns = [
    path('', include(router.urls)),
]
