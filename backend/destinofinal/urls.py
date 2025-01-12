from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CertificadoViewSet, PlasticoDetalleViewSet, FitosanitarioDetalleViewSet, MaterialDetalleViewSet
from django.http import JsonResponse



def destinofinal_root_view(request):
    return JsonResponse({
        "message": "Welcome to the Destino Final API. Use specific endpoints to access data."
    })
    

router = DefaultRouter()
router.register(r'certificados', CertificadoViewSet, basename='certificado')
router.register(r'plastico-detalle', PlasticoDetalleViewSet, basename='plastico_detalle')
router.register(r'fitosanitario-detalle', FitosanitarioDetalleViewSet, basename='fitosanitario_detalle')
router.register(r'material-detalle', MaterialDetalleViewSet, basename='material_detalle')

urlpatterns = [
    path('', include(router.urls)),
    path('', destinofinal_root_view, name='destinofinal-root'),

]
