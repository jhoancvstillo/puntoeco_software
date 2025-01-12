from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ConductorViewSet, CertificadoPesajeViewSet
from django.http import JsonResponse


def pesajes_root_view(request):
    return JsonResponse({
        "message": "Welcome to the Pesajes API. Use specific endpoints to access data."
    })
    

router = DefaultRouter()
router.register(r'conductores', ConductorViewSet, basename='conductor')
router.register(r'certificados', CertificadoPesajeViewSet, basename='certificado')




urlpatterns = [
    path('', include(router.urls)),
    path('', pesajes_root_view, name='pesajes-root'),
]
