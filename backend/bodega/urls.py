from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoriaViewSet, MarcaViewSet, ProductoViewSet, StockViewSet
from django.http import JsonResponse

def bodega_root_view(request):
    return JsonResponse({
        "message": "Bienvenido a la API de Bodega. Use los endpoints específicos para acceder a los datos."
    })
    

router = DefaultRouter()
router.register('categorias', CategoriaViewSet)
router.register('marcas', MarcaViewSet)
router.register('productos', ProductoViewSet)
router.register('stock', StockViewSet)



urlpatterns = [
    path('', include(router.urls)),
    path('', bodega_root_view, name='bodega-root'),
]
